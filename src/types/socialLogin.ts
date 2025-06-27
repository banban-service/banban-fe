export interface SocialLoginType {
  id: "kakao" | "google" | "naver";
  text: string;
  backgroundColor: string;
  fontColor: string;
  iconSrc: string;
  onClick: () => void;
}
