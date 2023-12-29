import QuizBox from './components/quiz-box';

/* eslint-disable-next-line */
export interface HomeUiProps {}

export function HomeUi(props: HomeUiProps) {
  return (
    <div className="h-[100vh] mx-auto flex flex-row items-center justify-center gap-4">
      <div className="container w-1/2">
        <div className="text-[200px] font-black uppercase absolute  text-indigo-400 text-opacity-20 top-40">
          Quiz
        </div>
        <div className="text-8xl font-black">
          Create your own quiz and enjoy
        </div>
      </div>
      <QuizBox />
    </div>
  );
}

export default HomeUi;
