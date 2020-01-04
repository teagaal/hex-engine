import { useType } from "@hex-engine/core";
import { useUpdate } from "../Canvas";

function Timer() {
  useType(Timer);

  let target = 0;

  const updateApi = useUpdate((delta) => {
    target += delta;
  });

  return {
    set(msFromNow: number) {
      target = -msFromNow;
    },
    delta() {
      return target;
    },
    ...updateApi,
  };
}

export default Timer;