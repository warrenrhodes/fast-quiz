import { IQuizGroup, IResponse } from '@fast-quiz/models';
import { dbPool } from './db_connect';

export abstract class DB_CRUD {
  static createQuiz = async (quiz: IQuizGroup): Promise<boolean> => {
    const { id: quiz_group_id, questions } = quiz;
    try {
      await dbPool.query('INSERT INTO quiz_groups (id ) VALUES ($1)', [
        quiz_group_id,
      ]);

      for (const question of questions) {
        const {
          id: quiz_id,
          title,
          answers,
          questionType,
          createdAt,
        } = question;

        await dbPool.query(
          'INSERT INTO quizzes (id, title, question_type, created_at, quiz_group_id) VALUES ($1, $2, $3, $4, $5)',
          [quiz_id, title, questionType, createdAt, quiz_group_id]
        );

        for (const currentAnswer of answers) {
          const { id, answer: answer } = currentAnswer;
          await dbPool.query(
            'INSERT INTO answers (id, answer, quiz_id) VALUES ($1, $2, $3)',
            [id, answer, quiz_id]
          );
        }
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  static getQuiz = async (quizID: string): Promise<IQuizGroup | undefined> => {
    try {
      let queryGroup: IQuizGroup = {
        id: quizID,
        questions: [],
      };

      const question_result = await dbPool.query(
        'SELECT * FROM quizzes WHERE quiz_group_id = $1',
        [quizID]
      );
      if (question_result.rowCount === 0) {
        return;
      }

      for (const question of question_result.rows) {
        const answer_result = await dbPool.query(
          'SELECT * FROM answers WHERE quiz_id = $1',
          [question.id]
        );

        if (answer_result.rowCount === 0) {
          continue;
        } else {
          queryGroup = {
            ...queryGroup,
            questions: [
              ...queryGroup.questions,
              {
                id: question.id,
                title: question.title,
                answers: answer_result.rows,
                createdAt: question.created_at,
                questionType: question.question_type,
              },
            ],
          };
        }
      }
      console.log(
        `quiz group retrieve successfully with data: ${JSON.stringify(
          queryGroup
        )}`
      );
      return queryGroup;
    } catch (error) {
      console.log(error);
      return;
    }
  };

  static answerToQuiz = async (answer: IResponse[]): Promise<boolean> => {
    try {
      for (const currentAnswer of answer) {
        await dbPool.query(
          'INSERT INTO answers (id, questionId, answers, groupId, createdAt) VALUES ($1, $2, $3, $4, $5)',
          [
            currentAnswer.id,
            currentAnswer.questionId,
            currentAnswer.questionId,
            currentAnswer.groupId,
            currentAnswer.createdAt,
          ]
        );
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  static getQuizResult = async (quizID: string): Promise<IResponse[]> => {
    try {
      const result = await dbPool.query(
        'SELECT * FROM answers WHERE groupId = $1',
        [quizID]
      );
      return result.rows;
    } catch (error) {
      console.log(error);
      return [];
    }
  };
}
