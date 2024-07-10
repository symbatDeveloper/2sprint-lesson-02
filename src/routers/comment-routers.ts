import {Router} from "express"
import {commentsController} from "../controllers/comment-controller";
import {inputValidationMiddleware} from "../middlewares/input-validation-middlware";
import {commentsInputValidationMiddleware} from "../middlewares/comments-input-validation-mw";


export const commentsRouter = Router()

commentsRouter.get('/:id', commentsController.getById)
commentsRouter.put('/:commentId', authBearerMiddleware, commentsInputValidationMiddleware, inputValidationMiddleware, commentsController.update)
commentsRouter.delete('/:commentId', authBearerMiddleware, inputValidationMiddleware, commentsController.delete)