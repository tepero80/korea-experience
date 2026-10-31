interface ArchiveStatsProps {
  title?: string;
  stats?: { value: string; label: string; [key: string]: unknown }[];
  source?: string;
  asOf?: string;
  variant?: string;
  columns?: number;
}
// The archive's source/asOf strings do not identify verified claims, and some
// contradict official information. Do not amplify these as measured statistics.
// Originals remain recoverable in Git. A future statistics component must read
// reviewed claim/source records; a JSX verified flag must never restore a claim.
export default function StatCard(_props: ArchiveStatsProps) {
  return null;
}
