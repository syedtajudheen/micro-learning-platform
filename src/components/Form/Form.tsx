import React from "react";
import styled from "styled-components";
import { Textarea } from "../ui/textarea";
import { updateFormSlide } from "@/store/features/editor/editorSlice";
import { useAppDispatch } from "@/store/hooks";

const inputClassName = "px-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none shadow-none focus:shadow-none resize-none";

export const Form = ({ id }) => {
  const dispatch = useAppDispatch();

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>, key: string) => {
    const lineHeight = 24;
    const minHeight = lineHeight;
    e.target.style.height = `${minHeight}px`;
    const newHeight = Math.max(minHeight, e.target.scrollHeight);
    e.target.style.height = `${newHeight}px`;

    dispatch(updateFormSlide({
      id,
      data: {
        [key]: e.target.value
      }
    }));
  };

  return (
    <QuizWrapper>
      <QuestionTextArea
        className={inputClassName}
        placeholder="Type your Question here"
        onInput={(e) => handleInput(e, "question")}
      />

      <CommentSection>
        <CommentTextArea
          className={inputClassName}
          placeholder="This is where your learners will type their responses. Once submitted, a response cannot be edited."
          onInput={(e) => handleInput(e, "comment")}
          rows={5}
        />
      </CommentSection>

    </QuizWrapper>
  );
};

const AutoGrowTextArea = styled(Textarea)`
  width: 100%;
  height: 32px;
  min-height: 32px;
  resize: none;
  overflow: hidden;
  line-height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  outline: none;
  color: inherit;

  &::placeholder {
    color: ${props => props?.isCorrect ? 'rgba(255,255,255,0.8)' : '#6b7280'};
  }
`;

const QuestionTextArea = styled(AutoGrowTextArea)`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 20px;
`;

const QuizWrapper = styled.div`
  background: transparent;
  border-radius: 12px;
  overflow: hidden;

  input {
    width: 100%;
    background: transparent;
    border: none;
    box-shadow: none;
    outline: none;
    color: inherit;
    font-size: 1rem;
    font-weight: 500;
    
    &::placeholder {
      color: ${props => props.isCorrect ? 'rgba(255,255,255,0.8)' : '#6b7280'};
    }
  }
`;

const CommentSection = styled.div`
  margin-top: 16px;
  padding: 8px 0;
  border-top: 1px solid #e5e7eb;
  border-radius: 12px;
  background-color: #ffffff;
  box-sizing: border-box;
`;

const CommentTextArea = styled(AutoGrowTextArea)`
  margin: 8px 8px 0 8px;
  width: 100%;
  color: #6b7280;
  font-size: 0.875rem;
  font-style: italic;
  line-height: 24px;
  width: -webkit-fill-available;
  height: 100%;
  min-height: 70px;
  overflow: auto;
`;
