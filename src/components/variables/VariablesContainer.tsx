"use client";

const VariablesContainer = () => {
  const data = [
    {
      name: "Name 1",
      value: "Value 1",
    },
    {
      name: "Name 2",
      value: "Value 2",
    },
  ];

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-10 w-full flex flex-col">
      <h3 className="text-center text-2xl font-bold mb-5">Variables</h3>

      <div className="flex gap-2">
        <input
          className="flex-1 border px-2 py-1"
          type="text"
          placeholder="Variable name"
        />
        <input
          className="flex-1 border px-2 py-1"
          type="text"
          placeholder="Variable value"
        />
        <button className="bg-indigo-600 text-white px-4 py-1 rounded hover:cursor-pointer hover:bg-indigo-500 disabled:opacity-50 active:scale-99">
          Add
        </button>
      </div>

      <div className="flex flex-col border border-gray-300">
        <div className="flex justify-between bg-gray-200 font-semibold">
          <div className="flex-1 pl-4 py-1">Name</div>
          <div className="flex-1 border-l border-gray-300 pl-4 py-1">Value</div>
          <div className="w-10 border-l border-gray-300 pl-4 py-1"></div>
        </div>
        {data.map((item) => (
          <div
            className="flex justify-between border-t border-gray-300"
            key={item.name}
          >
            <div className="flex-1 pl-4 py-1">{item.name}</div>
            <div className="flex-1 border-l border-gray-300 pl-4 py-1">
              {item.value}
            </div>
            <div className="border-l w-10 border-gray-300 py-1 flex justify-center">
              <button className="text-xl text-red-400">x</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariablesContainer;
