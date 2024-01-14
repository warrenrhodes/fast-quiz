import { PuffLoader } from 'react-spinners';

export const Loader = () => {
  return (
    <div className="h-[100vh] w-full place-items-center flex flex-col justify-center backdrop-blur bg-black/30 absolute z-40">
      <PuffLoader color="#3c47de" size={150} speedMultiplier={1} />
    </div>
  );
};
