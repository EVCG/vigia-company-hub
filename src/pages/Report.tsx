
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, Cell, Bar, XAxis, YAxis, Tooltip, Legend, Pie, ResponsiveContainer } from 'recharts';

const Report: React.FC = () => {
  // Dados para o gráfico de barras
  const barChartData = [
    { name: 'JAN', value: 24 },
    { name: 'FEV', value: 26 },
    { name: 'MAR', value: 12 },
    { name: 'ABR', value: 38 },
    { name: 'MAI', value: 48 },
    { name: 'JUN', value: 25 },
    { name: 'JUL', value: 18 },
    { name: 'AGO', value: 32 },
    { name: 'SET', value: 45 },
    { name: 'OUT', value: 25 },
    { name: 'NOV', value: 30 },
    { name: 'DEZ', value: 15 },
  ];
  
  // Dados para o gráfico de pizza
  const pieChartData = [
    { name: 'ComprasNet', value: 45, color: '#006837' },
    { name: 'BEC', value: 25, color: '#419873' },
    { name: 'Gov.br', value: 20, color: '#7DC9AA' },
    { name: 'Outros', value: 10, color: '#C0E6D2' },
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Relatórios</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de barras - Participações mensais */}
        <Card>
          <CardHeader>
            <CardTitle>Participações Mensais</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Participações" fill="#006837" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Gráfico de pizza - Distribuição por portais */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Portais</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Tabela de resultados */}
        <Card>
          <CardHeader>
            <CardTitle>Resultados Detalhados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Data</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Pregão</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Portal</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Órgão</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Valor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">12/03/2024</td>
                    <td className="py-2 px-4">PE-54/2024</td>
                    <td className="py-2 px-4">ComprasNet</td>
                    <td className="py-2 px-4">Ministério da Economia</td>
                    <td className="py-2 px-4 text-right">R$ 45.000,00</td>
                    <td className="py-2 px-4"><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Vencido</span></td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">23/03/2024</td>
                    <td className="py-2 px-4">PE-78/2024</td>
                    <td className="py-2 px-4">BEC</td>
                    <td className="py-2 px-4">Tribunal Regional Federal</td>
                    <td className="py-2 px-4 text-right">R$ 23.450,00</td>
                    <td className="py-2 px-4"><span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Perdido</span></td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">28/03/2024</td>
                    <td className="py-2 px-4">PE-32/2024</td>
                    <td className="py-2 px-4">ComprasNet</td>
                    <td className="py-2 px-4">Ministério da Saúde</td>
                    <td className="py-2 px-4 text-right">R$ 67.890,00</td>
                    <td className="py-2 px-4"><span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Em Andamento</span></td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">01/04/2024</td>
                    <td className="py-2 px-4">PE-12/2024</td>
                    <td className="py-2 px-4">Gov.br</td>
                    <td className="py-2 px-4">Universidade Federal</td>
                    <td className="py-2 px-4 text-right">R$ 98.765,00</td>
                    <td className="py-2 px-4"><span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Suspenso</span></td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">05/04/2024</td>
                    <td className="py-2 px-4">PE-45/2024</td>
                    <td className="py-2 px-4">ComprasNet</td>
                    <td className="py-2 px-4">Exército Brasileiro</td>
                    <td className="py-2 px-4 text-right">R$ 34.500,00</td>
                    <td className="py-2 px-4"><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Vencido</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Report;
