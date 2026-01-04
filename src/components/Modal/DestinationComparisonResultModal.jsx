export default function DestinationComparisonResultModal({ result }) {
  return (
    <div className="w-[500px] bg-[#020617] rounded-2xl p-6 text-white">
      <h2 className="text-lg font-bold mb-4 text-center">
        نتیجه مقایسه هوشمند
      </h2>

      <pre
        className="
          whitespace-pre-wrap
          text-sm
          leading-6
          bg-[#0f172a]
          p-4
          rounded-xl
          border border-white/10
        "
      >
        {result}
      </pre>
    </div>
  );
}
