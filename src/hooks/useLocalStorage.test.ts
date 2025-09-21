import { renderHook, act } from "@testing-library/react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { type Variable } from "types/variables";

describe("useLocalStorage", () => {
  const KEY = "test-key";

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("возвращает initialValue, если в localStorage пусто", () => {
    const initial: Variable[] = [{ name: "X", value: "123" }];

    const { result } = renderHook(() => useLocalStorage(KEY, initial));

    expect(result.current[0]).toEqual(initial);
  });

  it("читает из localStorage, если есть данные", () => {
    const stored: Variable[] = [{ name: "Y", value: "999" }];
    localStorage.setItem(KEY, JSON.stringify(stored));

    const { result } = renderHook(() => useLocalStorage(KEY, []));

    expect(result.current[0]).toEqual(stored);
  });

  it("сохраняет новое значение в localStorage", () => {
    const initial: Variable[] = [];
    const { result } = renderHook(() => useLocalStorage(KEY, initial));

    act(() => {
      result.current[1]([{ name: "Z", value: "555" }]);
    });

    expect(localStorage.getItem(KEY)).toBe(
      JSON.stringify([{ name: "Z", value: "555" }])
    );
    expect(result.current[0]).toEqual([{ name: "Z", value: "555" }]);
  });
});
