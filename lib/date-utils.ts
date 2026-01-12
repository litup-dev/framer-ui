import {
  format,
  startOfDay,
  endOfDay,
  isToday,
  isSameDay,
  startOfWeek,
  endOfWeek,
  parse,
  parseISO,
} from "date-fns";
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

/**
 * 주어진 날짜의 주 시작일(일요일)을 포맷된 문자열로 가져오는 함수
 * @param date - 기준 날짜 (기본값: 오늘)
 * @param formatString - 날짜 포맷 문자열 (기본값: 'yyyy-MM-dd')
 * @returns 포맷된 주 시작일 문자열
 */
export const getStartOfWeek = (
  date: Date = new Date(),
  formatString: string = "yyyy-MM-dd"
): string => {
  return format(startOfWeek(date), formatString, { locale: ko });
};

/**
 * 주어진 날짜의 주 마지막일(토요일)을 포맷된 문자열로 가져오는 함수
 * @param date - 기준 날짜 (기본값: 오늘)
 * @param formatString - 날짜 포맷 문자열 (기본값: 'yyyy-MM-dd')
 * @returns 포맷된 주 마지막일 문자열
 */
export const getEndOfWeek = (
  date: Date = new Date(),
  formatString: string = "yyyy-MM-dd"
): string => {
  return format(endOfWeek(date), formatString, { locale: ko });
};

/**
 * 날짜를 포맷된 문자열로 변환하는 함수
 * @param date - 포맷할 날짜
 * @param formatString - 날짜 포맷 문자열 (기본값: 'yyyy-MM-dd')
 * @returns 포맷된 날짜 문자열
 */
export const formatDate = (
  date: string,
  formatString: string = "yyyy-MM-dd"
): string => {
  return format(date, formatString, { locale: ko });
};

/**
 * 날짜 키 문자열을 Date 객체로 변환하는 함수 (시간대 문제 방지)
 * @param dateKey - 날짜 키 문자열 (예: "2025-11-01")
 * @returns Date 객체
 */
export const parseDateKey = (dateKey: string): Date => {
  return parse(dateKey, "yyyy-MM-dd", new Date());
};

/**
 * ISO 날짜 문자열에서 시간만 추출하는 함수
 * @param isoDateString - ISO 날짜 문자열 (예: "2025-11-01T20:00:00.000Z")
 * @returns 시간 문자열 (예: "20:00")
 */
export const extractTimeFromISO = (isoDateString: string): string => {
  const date = parseISO(isoDateString);
  return format(date, "HH:mm");
};

/**
 * 날짜를 월/일 형식으로 변환하는 함수 (예: "10/9")
 * @param date - 포맷할 날짜 (Date 객체 또는 날짜 문자열)
 * @returns 월/일 형식 문자열 (예: "10/9", "1/15")
 */
export const formatMonthDay = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "M/d");
};

/**
 * 가격 정보를 기반으로 입장료 문자열을 생성하는 함수
 * @param bookingPrice - 예약 가격
 * @param onsitePrice - 현장 가격
 * @returns 입장료 문자열
 */
export const formatEntryPrice = (
  bookingPrice: number,
  onsitePrice: number
): string => {
  if (bookingPrice === 0 && onsitePrice === 0) {
    return "무료입장";
  } else if (onsitePrice === 0) {
    return `예약 ${bookingPrice.toLocaleString()}원 / 현장 무료`;
  } else if (bookingPrice === 0) {
    return `현장 ${onsitePrice.toLocaleString()}원`;
  } else {
    return `예약 ${bookingPrice.toLocaleString()}원 / 현장 ${onsitePrice.toLocaleString()}원`;
  }
};
