import {Request, Response} from "express";
import {commentsMongoQueryRepository} from "../repositories/comment-repo/comment-mongo-query-repo";
import {InputCommentType} from "../types/comment-type";
import {commentService} from "../services/comment-service";
import {ResultStatus} from "../types/result-type";


export const commentsController = {
    async getById(req: Request<{ id: string }>, res: Response) {
        try {
            const getComment = await commentsMongoQueryRepository.getCommentById(req.params.id)
            if (!getComment) {
                res
                    .status(404)
                    .json({})
                return
            }
            res
                .status(200)
                .json(getComment)

        } catch (error) {
            res
                .status(500)
                .json({message: 'commentsController.getById'})
        }
    },

    async update(req: Request<{ commentId: string }, {}, InputCommentType>, res: Response) {
        try {
            const updateComment = await commentService.updateComment(req.params.commentId, req.body, req.user.id)
            if (updateComment.status === ResultStatus.NotFound) {
                res
                    .status(404)
                    .json({errorsMessages: updateComment.extensions || []})
                return
            }
            if (updateComment.status === ResultStatus.Forbidden) {
                res
                    .status(403)
                    .json({errorsMessages: updateComment.extensions || []})
                return
            }
            res
                .status(204)
                .json({})
        } catch (error) {
            res
                .status(500)
                .json({message: 'commentController.update'})
        }
    },

    async delete(req: Request<{ commentId: string }>, res: Response) {
        try {
            const deleteComment = await commentService.deleteCommentById(req.params.commentId, req.user.id)
            if (deleteComment.status === ResultStatus.BadRequest) {
                res
                    .status(400)
                    .json({errorsMessages: deleteComment.extensions || []})
                return
            }
            if (deleteComment.status === ResultStatus.NotFound) {
                res
                    .status(404)
                    .json({errorsMessages: deleteComment.extensions || []})
                return
            }
            if (deleteComment.status === ResultStatus.Forbidden) {
                res
                    .status(403)
                    .json({errorsMessages: deleteComment.extensions || []})
                return
            }
            res
                .status(204)
                .json({})
        } catch (error) {
            res
                .status(500)
                .json({message: 'commentController.update'})
        }
    }
}