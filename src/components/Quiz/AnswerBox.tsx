import React, { ReactElement } from "react";
import { motion } from "motion/react";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

import { Card, CardContent } from "../ui/card";

export enum AnswerStatus {
  CORRECT = "correct",
  PARTIAL = "partial",
  INCORRECT = "incorrect",
}

type StatusInfo = {
  text: string;
  icon: ReactElement;
  styles: string;
}
type Message = {
  correct: StatusInfo;
  partial: StatusInfo;
  incorrect: StatusInfo;
}

export const AnswerBox = ({ status }: { status: AnswerStatus.CORRECT | AnswerStatus.PARTIAL | AnswerStatus.INCORRECT }) => {

  const messages: Message = {
    correct: {
      text: "Great job! You got it right!",
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      styles: "border-green-500 bg-green-50 text-green-700",
    },
    partial: {
      text: "Almost there! Some answers are correct.",
      icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
      styles: "border-yellow-500 bg-yellow-50 text-yellow-700",
    },
    incorrect: {
      text: "Oops! That’s not the right answer.",
      icon: <XCircle className="w-6 h-6 text-red-600" />,
      styles: "border-red-500 bg-red-50 text-red-700",
    },
  };

  return (
    <motion.div className="mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className={`w-full p-4 border rounded-xl shadow-md flex items-center gap-3 ${messages[status].styles}`}>
        {messages[status].icon}
        <CardContent className="p-0">{messages[status].text}</CardContent>
      </Card>
    </motion.div>
  );
};
