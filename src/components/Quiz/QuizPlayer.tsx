import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import styled from "styled-components";
import { MultipleQuizSlide, QuizSlide, SingleQuizSlide } from "@/store/features/editor/types";
import { submitQuiz } from "@/store/features/contentPlayer/contentPlayerSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { AnswerBox, AnswerStatus } from "./AnswerBox";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

const { CORRECT, INCORRECT, PARTIAL } = AnswerStatus;

const inputClassName = "px-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none shadow-none focus:shadow-none resize-none";

export const QuizPlayer = ({ slide, onSubmit }: { slide: QuizSlide, onSubmit: () => void }) => {
  const dispatch = useAppDispatch();
  const quizResult = useAppSelector(state => state.contentPlayer.quizResults?.[slide.id]);
  const isQuizCompleted = !!quizResult;
  const [selectedAnswerOption, setSelectedAnswerOption] = useState<string | string[] | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOptionClick = (e, optionId: string) => {
    e.stopPropagation();
    if (isSubmitted) return;
    if (slide.quizType === 'multiple') {
      const isSelected = selectedAnswerOption?.includes(optionId);
      const selectedOptions = (selectedAnswerOption as string[]);
      const answers = isSelected ? selectedOptions?.filter((id) => id !== optionId) : [...selectedOptions, optionId];

      setSelectedAnswerOption(answers);
    } else {
      setSelectedAnswerOption(optionId);
      handleSubmitClick();
      dispatch(submitQuiz({
        id: slide.id,
        isCorrect: (optionId === (slide as SingleQuizSlide).answer),
        isPartiallyCorrect: false,
        selectedOptions: optionId
      }));
    }
  };

  const handleSubmitClick = () => {
    if (slide.quizType === 'multiple') {
      const answers = (slide as MultipleQuizSlide).answer;
      const answerMapping = (selectedAnswerOption as string[])?.reduce((
        acc: { [key: string]: boolean },
        selectedOption: string
      ) => {
        acc[selectedOption] = answers.includes(selectedOption);
        return acc;
      }, {});
      const correctAnswers = Object.keys(answerMapping).filter((selectedOption) => answerMapping[selectedOption]);

      dispatch(submitQuiz({
        id: slide.id,
        isCorrect: correctAnswers.length === answers.length,
        isPartiallyCorrect: correctAnswers.length > 0 && !(correctAnswers.length === answers.length),
        selectedOptions: selectedAnswerOption
      }))
    }
    setIsSubmitted(true);
    onSubmit();
  };

  useEffect(() => {
    if (isQuizCompleted) {
      setSelectedAnswerOption(quizResult?.selectedOptions);
      setIsSubmitted(true);
    } else {
      const defaultSelecterOption = (slide.quizType === 'multiple') ? [] : null;
      setSelectedAnswerOption(defaultSelecterOption);
      setIsSubmitted(false);
    }
  }, [slide]);

  const renderSingleSelect = () => {
    return (
      <RadioGroup >
        {slide.options.map((option) => (
          <Option
            key={option.id}
            className="flex items-center space-x-2"
            onClick={(e) => handleOptionClick(e, option.id)}
          >
            <RadioGroupItem
              value={option.id}
              checked={selectedAnswerOption === option.id}
              disabled={isSubmitted && !(selectedAnswerOption === option.id)}
            />
            <AutoGrowTextArea
              className={inputClassName}
              value={option.label}
              readOnly
            />
          </Option>
        ))}
      </RadioGroup>
    )
  }

  const renderMultiSelect = () => {
    return (
      <div className="flex flex-col gap-2">
        {slide.options.map((option) => (
          <Option
            key={option.id}
            className="flex items-center space-x-2"
            onClick={(e) => handleOptionClick(e, option.id)}
          >
            <Checkbox
              checked={selectedAnswerOption?.includes(option.id)}
            />
            <AutoGrowTextArea
              className={inputClassName}
              value={option.label}
              readOnly
            />
          </Option>
        ))}
        <Button
          className="mt-2"
          onClick={handleSubmitClick}
          disabled={isQuizCompleted || !selectedAnswerOption?.length}
        >Submit</Button>
      </div>
    )
  }

  return (
    <QuizWrapper>
      <QuestionTextArea
        className={inputClassName}
        value={slide.question}
        readOnly={true}
      />

      {slide?.quizType === "single" && renderSingleSelect()}
      {slide?.quizType === "multiple" && renderMultiSelect()}

      {quizResult && (
        <AnswerBox status={quizResult?.isCorrect ? CORRECT : quizResult?.isPartiallyCorrect ? PARTIAL : INCORRECT} />
      )}

      {(isSubmitted && slide?.comment) && (
        <CommentSection>
          <CommentTextArea
            className={inputClassName}
            value={slide.comment}
            readOnly
          />
        </CommentSection>
      )}
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
  overflow: hidden;
  width: 100%;
  
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

const Option = styled.div<{ isCorrect?: boolean }>`
  background: ${props => props.isCorrect ? 'linear-gradient(135deg, #34d399 0%, #10b981 100%)' : '#ffffff'};
  color: ${props => props.isCorrect ? '#ffffff' : '#1a1a1a'};
  padding: 0 8px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 0.05);
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgb(0 0 0 / 0.1);
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
