/**
 * Valor total devido numa inscrição.
 * Camisa só entra no total quando o participante opta por ela (wantsShirt).
 */
export function registrationTotal(
  price: number | null | undefined,
  shirtPrice: number | null | undefined,
  wantsShirt: boolean,
): number {
  return (price ?? 0) + (wantsShirt ? shirtPrice ?? 0 : 0);
}
