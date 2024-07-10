import {ObjectId} from "mongodb";
import {Paginator} from "../../types/paginator-types";
import {SortQueryFilterType} from "../../helpers/sort-query-fields-util";
import {OutputCommentType} from "../../types/comment-type";
import {PostDbType} from "../../db/post-db-type";
import {commentCollection, postCollection} from "../../db/mongo-db";
import {CommentDbType} from "../../db/comment-db-type";

export const commentsMongoQueryRepository = {
    async getCommentsByPostId(postId: string, inputQuery: SortQueryFilterType): Promise<Paginator<OutputCommentType[]> | null> {
        if (!this.checkObjectId(postId)) return null
        const post = await this.findPostById(new ObjectId(postId))
        if (!post) return null
        const byId = postId ? {postId: new ObjectId(postId)} : {}
        const filter = {
            ...byId
        }
        const items = await commentCollection
            .find(filter)
            .sort(inputQuery.sortBy, inputQuery.sortDirection)
            .skip((inputQuery.pageNumber - 1) * inputQuery.pageSize)
            .limit(inputQuery.pageSize)
            .toArray()
        const totalCount = await commentCollection.countDocuments(filter)
        return {
            pagesCount: Math.ceil(totalCount / inputQuery.pageSize),
            page: inputQuery.pageNumber,
            pageSize: inputQuery.pageSize,
            totalCount,
            items: items.map(this.commentMap)
        }
    },

    async findById(id: ObjectId): Promise<CommentDbType | null> {
        return await commentCollection.findOne({_id: id})
    },

    async findPostById(postId: ObjectId): Promise<PostDbType | null> {
        return await postCollection.findOne({_id: postId})
    },
    async getCommentById(id: string): Promise<OutputCommentType | null> {
        if (!this.checkObjectId(id)) return null
        const comment = await this.findById(new ObjectId(id))
        if (!comment) return null
        return this.commentMap(comment)
    },

    commentMap(comment: CommentDbType): OutputCommentType {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt,
        }
    },

    checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}