import { useEffect, useState } from "react";
import { compressImage } from "@/utils/compress";
import Image from "next/image";
import styled from "styled-components";
import { AddIcon } from "../svg";
import { useToast } from "../common/Toast/useToast";
import { useUploadProfileImage } from "@/hooks/useUploadProfileImage";

export interface RegisterRequestType {
  email: string;
  name: string;
  accountId: string;
  profileImageUrl: File | string | null;
  termsOfServiceConsent: boolean;
  privacyPolicyConsent: boolean;
}

export default function ProfileImageContainer({
  imageUrl,
  setImageUrl,
}: {
  imageUrl?: string | null;
  setImageUrl?: React.Dispatch<React.SetStateAction<RegisterRequestType>>;
}) {
  const { showToast } = useToast();

  const [newImage, setNewImage] = useState<string | undefined>(undefined);
  const [hasError, setHasError] = useState(false);

  const displayImage =
    !hasError && (imageUrl || newImage) ? imageUrl || newImage : "/no_img.png";

  const uploadProfileImageMutation = useUploadProfileImage();

  // 프로필 편집 모드인지 회원가입 모드인지 판단
  const isProfileEditMode = !setImageUrl;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputFile = e.target?.files?.[0];
    if (!inputFile) return;
    const getFileExt = (fileName: string) => {
      const ext = fileName.split(".").pop()?.toLowerCase();
      if (ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "webp") {
        return ext;
      }
      return null;
    };

    // 파일 크기 검증 (5MB)
    if (inputFile.size > 5 * 1024 * 1024) {
      showToast({
        type: "error",
        message: "파일 크기는 5MB를 초과할 수 없습니다.",
      });
      return;
    }

    if (inputFile) {
      const ext = getFileExt(inputFile.name);
      if (!ext) {
        showToast({ type: "error", message: "이미지 파일이 아닙니다." });
        return null;
      }
      let imageUrl: string | null = null;

      try {
        if (ext) {
          const convertedFile = await compressImage(inputFile);
          console.log(convertedFile);
          if (!convertedFile) return;
          imageUrl = URL.createObjectURL(convertedFile);

          // 프로필 편집 모드일 때: 즉시 API 호출
          if (isProfileEditMode) {
            uploadProfileImageMutation.mutate(
              { file: convertedFile },
              {
                onSuccess: () => {
                  showToast({
                    type: "success",
                    message: "프로필 이미지가 업데이트되었습니다.",
                    duration: 3000,
                  });
                },
                onError: (error) => {
                  console.error("프로필 이미지 업로드 실패:", error);
                  showToast({
                    type: "error",
                    message: "프로필 이미지 업로드에 실패했습니다.",
                    duration: 3000,
                  });
                  return;
                },
              },
            );
          }
        } else {
          imageUrl = URL.createObjectURL(inputFile);
        }
        setNewImage(imageUrl);

        // 회원가입 모드일 때: 상태에 저장
        if (setImageUrl) {
          setImageUrl((prev) => ({
            ...prev,
            profileImageUrl: inputFile,
          }));
        }
      } catch (error) {
        console.error("Error processing file:", error);
        showToast({ type: "error", message: "처리중 오류가 발생했습니다." });
      }
    }
  };

  useEffect(() => {
    return () => {
      if (newImage) {
        URL.revokeObjectURL(newImage);
      }
    };
  }, [newImage]);

  return (
    <Container>
      <ProfileImageWrapper>
        <StyledProfileImage
          width={92}
          height={92}
          src={(displayImage ?? "/no_img.png") as string}
          alt="upload_image"
          onError={() => {
            setHasError(true);
          }}
          unoptimized={true}
        />
      </ProfileImageWrapper>
      <label
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          opacity: uploadProfileImageMutation.isPending ? 0.5 : 1,
          cursor: uploadProfileImageMutation.isPending
            ? "not-allowed"
            : "pointer",
        }}
      >
        <input
          type="file"
          accept="image/jpeg, image/jpg, image/bmp, image/webp, image/png, image/gif"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploadProfileImageMutation.isPending}
        />
        <Wrapper>
          {uploadProfileImageMutation.isPending ? (
            <span style={{ fontSize: "10px", color: "white" }}>...</span>
          ) : (
            <AddIcon width={15} height={15} color="white" />
          )}
        </Wrapper>
      </label>
    </Container>
  );
}

const ProfileImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 4px;
  width: 100px;
  height: 100px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0px 12px 16px -4px rgba(10, 13, 18, 0.08);
  overflow: hidden;
`;

const StyledProfileImage = styled(Image)`
  border-radius: 50%;
  object-fit: cover;
`;

const Container = styled.div`
  position: relative;
`;

const Wrapper = styled.div`
  background-color: #d5d7da;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 100%;
  padding: 8px;
  cursor: pointer;
`;
