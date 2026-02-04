'use client';

interface ComparisonRow {
  feature: string;
  option1: string | boolean;
  option2: string | boolean;
  option3?: string | boolean;
  option4?: string | boolean;
  option5?: string | boolean;
  option6?: string | boolean;
}

interface ComparisonTableProps {
  title?: string;
  headers: string[];
  rows: ComparisonRow[];
}

export default function ComparisonTable({ title, headers, rows }: ComparisonTableProps) {
  const renderCell = (value: string | boolean | undefined) => {
    if (value === undefined) return null;
    if (typeof value === 'boolean') {
      return value ? (
        <span className="text-2xl">✅</span>
      ) : (
        <span className="text-2xl">❌</span>
      );
    }
    return <span className="text-sm text-gray-700">{value}</span>;
  };

  // Dynamically get option keys from the first row
  const getOptionCells = (row: ComparisonRow) => {
    const options: (string | boolean | undefined)[] = [
      row.option1,
      row.option2,
      row.option3,
      row.option4,
      row.option5,
      row.option6,
    ];
    
    // Return only the options that correspond to headers (excluding "feature" header)
    return options.slice(0, headers.length - 1);
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
                  className="px-4 py-4 text-center text-sm md:text-lg font-black text-white uppercase tracking-wide"
                  style={{ backgroundColor: 'transparent' }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className={`${
                  rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } hover:bg-blue-50 transition-colors`}
              >
                <td className="px-4 py-4 font-bold text-gray-900 text-sm md:text-base">
                  {row.feature}
                </td>
                {getOptionCells(row).map((option, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-4 text-center text-sm md:text-base">
                    {renderCell(option)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
