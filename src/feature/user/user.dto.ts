export class UserDTO {
  readonly userId: number;
  readonly userName: string;
  readonly userPwd: string;
  readonly roleId: number;
  readonly userNickName: string;
  readonly userAddress: string;
  readonly userPhone: string;
  readonly userEmail: string;
  readonly userAvatar: string;
  readonly userOrgnName: string;
  readonly userPosition: string;
  readonly userMajor: string;
  readonly userIntroduct: string;
  readonly userRelate: string;
  readonly userLoginTime: string;
  readonly createTime: string;
  readonly updateTime: string;
}

export class UserParams {
  readonly pageNum: number;
  readonly pageSize: number;
  readonly sortType: string;
  readonly userNickName?: string;
  readonly userIntroduct?: string;
  readonly userDate?: string;
}
