export default function truncateEllipsisString(
  string: string,
  maxLength: number,
): string {
  if (string.length <= maxLength) {
    return string;
  }

  const words = string.split(' ');
  let result = '';

  for (const word of words) {
    if (result.length + word.length + '...'.length > maxLength) {
      return result + '...';
    } else {
      result += (result ? ' ' : '') + word;
    }
  }

  return result + '...';
}
