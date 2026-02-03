'use client';

interface ComparisonRow {
  feature: string;
  option1: string | boolean;
  option2: string | boolean;
  option3?: string | boolean;
}

interface ComparisonTableProps {
  title?: string;
  headers: string[];
  rows: ComparisonRow[];
}

export default function ComparisonTable({ title, headers, rows }: ComparisonTableProps) {
  const renderCell = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <span className="text-2xl">✅</span>
      ) : (
        <span className="text-2xl">❌</span>
      );
    }
    return <span className="text-sm text-gray-700">{value}</span>;
  };

  return (
    <div className="my-8">
      {title && (
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
          <thead style={{ background: 'linear-gradient(to right, #1e3a8a, #1e40af)' }}>
            <tr>
              {headers.map((header, index) => (
                <th 
                  key={index}
                  className="px-6 py-6 text-center text-xl font-black text-white uppercase tracking-wide"
                  style={{ backgroundColor: 'transparent' }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr 
                key={index}
                className={`${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } hover:bg-blue-50 transition-colors`}
              >
                <td className="px-6 py-5 font-bold text-gray-900 text-base">
                  {row.feature}
                </td>
                <td className="px-6 py-5 text-base">
                  {renderCell(row.option1)}
                </td>
                <td className="px-6 py-5 text-base">
                  {renderCell(row.option2)}
                </td>
                {row.option3 !== undefined && (
                  <td className="px-6 py-5 text-base">
                    {renderCell(row.option3)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
