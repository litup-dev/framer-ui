import { format, startOfDay, endOfDay, isToday, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";

/**
 * 오늘의 날짜를 가져오는 함수
 * @param formatString - 날짜 포맷 문자열 (기본값: 'yyyy-MM-dd')
 * @returns 포맷된 오늘 날짜 문자열
 */
export const getToday = (formatString: string = "yyyy-MM-dd"): string => {
  const today = new Date();
  return format(today, formatString, { locale: ko });
};

/**
 * 오늘의 날짜 객체를 가져오는 함수
 * @returns 오늘의 Date 객체
 */
export const getTodayDate = (): Date => {
  return new Date();
};

/**
 * 오늘의 시작 시간 (00:00:00)을 가져오는 함수
 * @returns 오늘의 시작 시간 Date 객체
 */
export const getTodayStart = (): Date => {
  return startOfDay(new Date());
};

/**
 * 오늘의 끝 시간 (23:59:59)을 가져오는 함수
 * @returns 오늘의 끝 시간 Date 객체
 */
export const getTodayEnd = (): Date => {
  return endOfDay(new Date());
};

/**
 * 주어진 날짜가 오늘인지 확인하는 함수
 * @param date - 확인할 날짜
 * @returns 오늘인지 여부
 */
export const isTodayDate = (date: Date): boolean => {
  return isToday(date);
};

/**
 * 두 날짜가 같은 날인지 확인하는 함수
 * @param date1 - 첫 번째 날짜
 * @param date2 - 두 번째 날짜
 * @returns 같은 날인지 여부
 */
export const isSameDate = (date1: Date, date2: Date): boolean => {
  return isSameDay(date1, date2);
};

/**
 * 오늘의 한국어 날짜 문자열을 가져오는 함수
 * @returns 한국어로 포맷된 오늘 날짜 (예: "2024년 1월 15일 월요일")
 */
export const getTodayKorean = (): string => {
  const today = new Date();
  return format(today, "yyyy년 M월 d일 EEEE", { locale: ko });
};

/**
 * 오늘의 요일을 가져오는 함수
 * @returns 오늘의 요일 (예: "월요일")
 */
export const getTodayWeekday = (): string => {
  const today = new Date();
  return format(today, "EEEE", { locale: ko });
};

/**
 * 오늘의 일(day)을 가져오는 함수
 * @returns 오늘의 일 (예: 13)
 */
export const getTodayDay = (): number => {
  const today = new Date();
  return today.getDate();
};

/**
 * 오늘의 일(day)을 문자열로 가져오는 함수
 * @returns 오늘의 일 문자열 (예: "13")
 */
export const getTodayDayString = (): string => {
  const today = new Date();
  return format(today, "d");
};

/**
 * 오늘의 일(day)을 두 자리 문자열로 가져오는 함수
 * @returns 오늘의 일 두 자리 문자열 (예: "13", "03")
 */
export const getTodayDayPadded = (): string => {
  const today = new Date();
  return format(today, "dd");
};
