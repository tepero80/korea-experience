'use client';

interface ComparisonRow {
  feature: string;
  option1?: string | boolean;
  option2?: string | boolean;
  option3?: string | boolean;
  option4?: string | boolean;
  option5?: string | boolean;
  option6?: string | boolean;
  item1?: string | boolean;
  item2?: string | boolean;
  item3?: string | boolean;
  item4?: string | boolean;
  item5?: string | boolean;
  item6?: string | boolean;
  cell1?: string | boolean;
  cell2?: string | boolean;
  cell3?: string | boolean;
  cell4?: string | boolean;
  cell5?: string | boolean;
  cell6?: string | boolean;
}

interface ComparisonTableProps {
  title?: string;
  headers?: string[];
  rows?: ComparisonRow[];
  items?: ComparisonRow[];
}

export default function ComparisonTable({ title, headers, rows, items }: ComparisonTableProps) {
  const data = rows ?? items ?? [];
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

  // Auto-generate headers from first row keys if not provided
  const resolvedHeaders = headers ?? (() => {
    if (data.length === 0) return ['Feature'];
    const first = data[0];
    const cols = ['Feature'];
    for (let i = 1; i <= 6; i++) {
      if (first[`option${i}` as keyof ComparisonRow] !== undefined ||
          first[`item${i}` as keyof ComparisonRow] !== undefined ||
          first[`cell${i}` as keyof ComparisonRow] !== undefined) {
        cols.push(`Option ${i}`);
      }
    }
    return cols;
  })();

  // Dynamically get option cells, supporting both option* and item* keys
  const getOptionCells = (row: ComparisonRow) => {
    const options: (string | boolean | undefined)[] = [
      row.option1 ?? row.item1 ?? row.cell1,
      row.option2 ?? row.item2 ?? row.cell2,
      row.option3 ?? row.item3 ?? row.cell3,
      row.option4 ?? row.item4 ?? row.cell4,
      row.option5 ?? row.item5 ?? row.cell5,
      row.option6 ?? row.item6 ?? row.cell6,
    ];
    
    // Return only the options that correspond to headers (excluding "feature" header)
    return options.slice(0, resolvedHeaders.length - 1);
  };

  return (
    <div className="my-8">
      {title && (
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
          <thead style={{ background: 'linear-gradient(to right, #44403c, #292524, #44403c)' }}>
            <tr>
              {resolvedHeaders.map((header, index) => (
                <th 
                  key={index}
                  className="px-4 py-3 text-center text-sm md:text-lg font-black text-white uppercase tracking-wide"
                  style={{ backgroundColor: 'transparent', color: 'white' }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className={`${
                  rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } hover:bg-amber-50 transition-colors`}
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
