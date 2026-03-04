export function getTrialDays(
  trialInterval: string,
  trialIntervalCount: number,
) {
  let trialDays: number | undefined = undefined;

  if (trialIntervalCount) {
    if (trialInterval === "day") {
      trialDays = trialIntervalCount;
    } else if (trialInterval === "week") {
      trialDays = trialIntervalCount * 7;
    } else if (trialInterval === "month") {
      trialDays = trialIntervalCount * 30;
    } else if (trialInterval === "year") {
      trialDays = trialIntervalCount * 365;
    }
  }

  return trialDays;
}
