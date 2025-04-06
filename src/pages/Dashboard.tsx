
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, Cell, Bar, XAxis, YAxis, Tooltip, Legend, Pie, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  // Dados para os cards
  const cardData = [
    { id: 1, title: 'Cadastrados', value: '00', icon: '📋' },
    { id: 2, title: 'Pregões vencidos', value: '00', icon: '🏆' },
    { id: 3, title: 'Disputados', value: '00', icon: '👥' },
    { id: 4, title: 'Vencidos', value: '00', icon: '💼' },
  ];
  
  // Dados para o gráfico de barras
  const barChartData = [
    { name: 'MAR/2024', value: 24 },
    { name: 'ABR/2024', value: 26 },
    { name: 'MAI/2024', value: 12 },
    { name: 'JUN/2024', value: 8 },
    { name: 'JUL/2024', value: 48 },
    { name: 'AGO/2024', value: 25 },
    { name: 'SET/2024', value: 18 },
    { name: 'OUT/2024', value: 100 },
  ];
  
  // Dados para o gráfico de pizza
  const pieChartData = [
    { name: 'MINISTÉRIO DA ECONOMIA', value: 400, color: '#0088FE' },
    { name: 'AGÊNCIA DO BRASIL', value: 300, color: '#00C49F' },
    { name: 'AUTORIDADE NACIONAL DE PROTEÇÃO DE DADOS', value: 300, color: '#FFBB28' },
    { name: 'TRIBUNAL REGIONAL ELEITORAL', value: 200, color: '#FF8042' },
    { name: 'ESPECIALIZADA EM TECNOLOGIA', value: 150, color: '#8884d8' },
    { name: 'INSTITUTO DE CIÊNCIA', value: 100, color: '#82ca9d' },
    { name: 'AUTORIDADE ELEITORAL', value: 50, color: '#ffc658' },
  ];
  
  // Dados para a tabela de últimas disputas
  const tableData = [
    { cnpj: '10.797.693/0001-99', portal: 'ComprasME', pregao: '90/94/2024', uasg: '153173', totalVencido: 'R$ 0,00' },
    { cnpj: '10.797.693/0001-99', portal: 'ComprasME', pregao: '90/90/2024', uasg: '389162', totalVencido: 'R$ 0,00' },
    { cnpj: '10.797.693/0001-99', portal: 'ComprasME', pregao: '42/03/4', uasg: '42303/4', totalVencido: 'R$ 0,00' },
    { cnpj: '10.797.693/0001-99', portal: 'ComprasME', pregao: '90/09/2024', uasg: '715633', totalVencido: 'R$ 0,00' },
    { cnpj: '10.797.693/0001-99', portal: 'ComprasME', pregao: '15/00/2024', uasg: '150000', totalVencido: 'R$ 0,00' },
  ];
  
  return (
    <div className="space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((card) => (
          <Card key={card.id} className="bg-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-3xl font-bold">{card.value}</p>
              </div>
              <div className="text-3xl">{card.icon}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de barras */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              Relação de Aproveitamento por Item
              <span className="ml-1 text-gray-400 cursor-help text-sm">ⓘ</span>
            </CardTitle>
            <p className="text-xs text-gray-500">Últimos 12 meses</p>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" fontSize={10} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#006837" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Gráfico de pizza */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              Comparativo entre Órgãos
              <span className="ml-1 text-gray-400 cursor-help text-sm">ⓘ</span>
            </CardTitle>
            <p className="text-xs text-gray-500">Total Recebido + Quantidade de Itens e Quantidade de Licitações</p>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name }) => name.substring(0, 10) + "..."}
                  labelLine={false}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend layout="vertical" align="right" verticalAlign="middle" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            Últimas Disputas
            <span className="ml-1 text-gray-400 cursor-help text-sm">ⓘ</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">CNPJ</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Portal</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Pregão</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">UASG</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Total Vencido</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{row.cnpj}</td>
                    <td className="py-2 px-4">{row.portal}</td>
                    <td className="py-2 px-4">{row.pregao}</td>
                    <td className="py-2 px-4">{row.uasg}</td>
                    <td className="py-2 px-4">{row.totalVencido}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
