import { useRef } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import styled from "styled-components";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { PlusCircle, X } from "lucide-react";
import { Separator } from "../ui/separator";
import { BottomSheet } from "../BottomSheet";
import { closeBottomSheet, setQuizType, updateQuizSlide } from "@/store/features/editor/editorSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Checkbox } from "../ui/checkbox";
import { MultipleQuizSlide, QuizSlide, SingleQuizSlide } from "@/store/features/editor/types";

const inputClassName = "px-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none shadow-none focus:shadow-none resize-none";

const placeholder = "Type your option here";

export const Quiz = ({ id }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const isBottomSheetOpen = useAppSelector((state) => state.editor.bottomSheet?.[id] || false);
  const slide = useAppSelector((state) => state.editor.slidesById?.[id] as QuizSlide || null);

  const adjustHeight = (e) => {
    const lineHeight = 24;
    const minHeight = lineHeight;
    e.target.style.height = `${minHeight}px`;
    const newHeight = Math.max(minHeight, e.target.scrollHeight);
    e.target.style.height = `${newHeight}px`;
  };

  const handleQuestionInput = (e: React.ChangeEvent<HTMLTextAreaElement>, key: string) => {
    adjustHeight(e);
    dispatch(updateQuizSlide({
      id,
      data: {
        [key]: e.target.value
      }
    }));
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>, optionId: string) => {
    adjustHeight(e);
    dispatch(updateQuizSlide({
      id,
      data: {
        options: slide.options.map((option) => (option.id === optionId) ? { ...option, label: e.target.value } : option),
      }
    }));
  };

  const handleAddOptionClick = () => {
    dispatch(updateQuizSlide({
      id,
      data: {
        options: [
          ...slide.options,
          {
            id: `option-${slide.options.length + 1}`,
            label: `Option ${slide.options.length + 1}`
          }
        ]
      }
    }));
  };

  const handleOptionClick = (optionId: string) => {
    let data = {};
    if (slide.quizType === 'multiple') {
      const isSelected = slide.answer.includes(optionId);
      const answers = isSelected ? (slide as MultipleQuizSlide).answer.filter((answerId) => answerId !== optionId) : [...(slide as MultipleQuizSlide).answer, optionId];
      data = { answer: answers };
    } else {
      data = { answer: optionId };
    }
    dispatch(updateQuizSlide({
      id,
      data
    }));
  };

  const handleQuizTypeBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { target: { name } } = e;
    const type = (name === "single") ? "single" : "multiple";
    dispatch(closeBottomSheet(id));
    dispatch(setQuizType({ id, type }));
  };

  const renderSingleSelect = () => {
    return (
      <RadioGroup defaultValue="option-one">
        {slide.options.map((option) => (
          <Option key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem
              // defaultValue={selectedAnswerOption}
              // checked={selectedAnswerOption === option.id}
              checked={(slide as SingleQuizSlide).answer === option.id}
              onClick={() => handleOptionClick(option.id)}
            />
            <AutoGrowTextArea
              className={inputClassName}
              placeholder={placeholder}
              onInput={(e) => handleInput(e, option.id)}
            />
          </Option>
        ))}
        <Button className="mx-0 px-0 w-full" size={'sm'} variant="default" onClick={handleAddOptionClick}>
          <PlusCircle /> Add an option
        </Button>
      </RadioGroup>
    )
  }

  const renderMultiSelect = () => {
    return (
      <div className="flex flex-col gap-2">
        {slide.options.map((option) => (
          <Option key={option.id} className="flex items-center space-x-2">
            <Checkbox id="terms"
              checked={(slide as MultipleQuizSlide).answer.includes(option.id)}
              onClick={() => handleOptionClick(option.id)} />
            <AutoGrowTextArea
              className={inputClassName}
              placeholder={placeholder}
              onInput={(e) => handleInput(e, option.id)}
            />
          </Option>
        ))}
        <Button className="mx-0 px-0 w-full" size={'sm'} variant="default" onClick={handleAddOptionClick}>
          <PlusCircle /> Add an option
        </Button>
      </div>
    )
  }

  return (
    <QuizWrapper>
      <QuestionTextArea
        className={inputClassName}
        placeholder="Type your Question here"
        onInput={(e) => handleQuestionInput(e, 'question')}
      />

      {slide?.quizType === "single" && renderSingleSelect()}
      {slide?.quizType === "multiple" && renderMultiSelect()}

      <CommentSection>
        <CommentTitle>
          Comment <span>(optional)</span>
        </CommentTitle>
        <Separator />
        <CommentTextArea
          className={inputClassName}
          placeholder="Comment will be displyed after the user choose any answers"
          onInput={(e) => handleQuestionInput(e, 'comment')}
        />
      </CommentSection>

      <BottomSheet isOpen={isBottomSheetOpen} onClose={() => dispatch(closeBottomSheet(id))} container={containerRef.current}>
        <div className="flex flex-col align-center">
          {/* <Button
            className="self-end"
            variant={"ghost"}
            size="sm"
            onClick={() => dispatch(closeBottomSheet(id))}
          >
            <X />
          </Button> */}
          <Button name="single" variant="secondary" size="sm" onClick={handleQuizTypeBtnClick}>Single Select Option</Button>
          <p className="text-sm self-center">(or)</p>
          <Button name="multiple" variant="secondary" size="sm" onClick={handleQuizTypeBtnClick}>Multiple Select Option</Button>
        </div>
      </BottomSheet>

    </QuizWrapper>
  );
};



const CommentTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 0 8px 8px;
  color: #6b7280;
  font-size: 0.875rem;
`;

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

const Option = styled.div<{ isCorrect?: boolean }>`
  background: ${props => props.isCorrect ? 'linear-gradient(135deg, #34d399 0%, #10b981 100%)' : '#ffffff'};
  color: ${props => props.isCorrect ? '#ffffff' : '#1a1a1a'};
  padding: 0 8px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 0.05);
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
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
