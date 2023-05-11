// /api/comment
import express from 'express';
// import Comment from '../schemas/comments'; // 바꾸기

const router = express.Router();

// router.post('/add', async (req, res) => {
//     const { commenter, comment } = req.body;

//     try {
//         const createdComment = await Comment.create({ commenter, comment });
//         console.log(createdComment);

//         // 연결 데이터 가져오기
//         const commentInfo = await Comment.find({ commenter: commenter }).populate('commenter');
//         console.log(commentInfo);
//     } catch (err) {
//         console.log(err);
//     }

//     res.end();
// });

export default router;
