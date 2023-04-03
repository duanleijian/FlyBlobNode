export class NoticeDTO {
  readonly noticeId: number;
  readonly noticeTitle: string;
  readonly noticeTip: string;
  readonly noticeReceiverIds: string;
  readonly noticeReceiverName: string;
  readonly noticeContent: string;
  readonly noticeTime: string;
  readonly noticeStatus: number;
}

export class NoticeParams {
  readonly pageNum: number;
  readonly pageSize: number;
  readonly sortType: string;
  readonly noticeTitle: string;
  readonly noticeContent: string;
  readonly noticeTime: string;
  readonly noticeStatus: number;
}
