import Observer from '../observer';


export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments;
  }

  addComment(comment) {
    this._comments.append(comment);
  }

  getComments() {
    return this._comments;
  }

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
        {},
        {
          text: comment.comment,
          date: comment.date !== null ? new Date(comment.date) : comment.date,
          id: comment.id,
          author: comment.author,
          emotion: comment.emotion
        }
    );
    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
        {},
        {
          "comment": comment.comment,
          "date": new Date(comment.date),
          "emotion": comment.emotion
        }
    );
    return adaptedComment;
  }
}
