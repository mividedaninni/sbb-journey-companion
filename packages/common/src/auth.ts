export interface AuthRequestDto {
  username: string;
  password: string;
}

export interface JwtPayloadDto {
  id: string;
  username: string;
}

export interface UserDto extends JwtPayloadDto {
  isAdmin: boolean;
}

export interface AuthResponseDto {
  accessToken: string;
  user: UserDto;
}
