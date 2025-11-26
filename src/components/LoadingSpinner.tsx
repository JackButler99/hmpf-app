export default function LoadingSpinner() {
  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <div className="
        relative w-16 h-16 
        rounded-full 
        border-4 border-slate-300/30 
        border-t-blue-600
        animate-spin
        backdrop-blur-xl
      "></div>
    </div>
  );
}
