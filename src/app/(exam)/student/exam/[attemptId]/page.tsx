import { redirect } from "next/navigation";
import { getExamData } from "@/app/actions/mock-test";
import { ExamClient } from "@/components/student/exam-client";

interface Props {
  params: Promise<{ attemptId: string }>;
}

// No chrome — full screen exam
export const metadata = { title: "CSCA Exam — NiHao Academy" };

export default async function ExamPage({ params }: Props) {
  const { attemptId } = await params;

  let data;
  try {
    data = await getExamData(attemptId);
  } catch {
    redirect("/student/dashboard");
  }

  const { attempt, test, questions, savedAnswers } = data!;

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">
          No questions found for this test. Please contact support.
        </p>
      </div>
    );
  }

  return (
    <ExamClient
      attemptId={attempt.id}
      test={test}
      questions={questions}
      savedAnswers={savedAnswers}
      startedAt={attempt.started_at}
    />
  );
}
