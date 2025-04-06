
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, Cell, Bar, XAxis, YAxis, Tooltip, Legend, Pie, ResponsiveContainer } from 'recharts';
import { monitoringService } from '@/services/monitoringService';
import { MonitoringItem } from '@/types/types';

const Dashboard: React.FC = () => {
  const [monitoringItems, setMonitoringItems] = useState<MonitoringItem[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [disputedCount, setDisputedCount] = useState(0);
  const [wonCount, setWonCount] = useState(0);
  const [barChartData, setBarChartData] = useState<{ name: string; value: number }[]>([]);
  const [pieChartData, setPieChartData] = useState<{ name: string; value: number; color: string }[]>([]);

  useEffect(() => {
    // Buscar itens de monitoramento
    const items = monitoringService.getMonitoringItems();
    setMonitoringItems(items);

    // Contar itens ativos
    const activeItems = items.filter(item => item.status === 'active');
    setActiveCount(activeItems.length);

    // Dados para tabela (disputados)
    // Simular que todos na tabela de últimas disputas foram disputados
    setDisputedCount(5); // Quantidade de itens na tabela de disputas

    // Simular pregões vencidos (metade dos disputados)
    setWonCount(Math.floor(disputedCount / 2));

    // Processar dados para o gráfico de barras
    // Agrupar por mês/ano da data do pregão
    const months: { [key: string]: number } = {};
    items.forEach(item => {
      const dateParts = item.date.split('/');
      if (dateParts.length === 3) {
        const month = dateParts[1];
        const year = dateParts[2];
        const key = `${month}/${year}`;
        if (months[key]) {
          months[key]++;
        } else {
          months[key] = 1;
        }
      }
    });

    const barData = Object.entries(months).map(([name, value]) => ({
      name,
      value
    }));
    setBarChartData(barData);

    // Processar dados para o gráfico de pizza
    // Agrupar por empresa
    const companies: { [key: string]: number } = {};
    items.forEach(item => {
      if (companies[item.company]) {
        companies[item.company]++;
      } else {
        companies[item.company] = 1;
      }
    });

    // Cores para o gráfico
    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
    
    const pieData = Object.entries(companies).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
    setPieChartData(pieData);

  }, [disputedCount]);
  
  // Dados para a tabela de últimas disputas
  const tableData = [
    { cnpj: '10.797.693/0001-99', portal: 'ComprasME', pregao: '90/94/2024', uasg: '153173', totalVencido: 'R$ 0,00' },
    { cnpj: '10.797.693/0001-99', portal: 'ComprasME', pregao: '90/90/2024', uasg: '389162', totalVencido: 'R$ 0,00' },
    { cnpj: '10.797.693/0001-99', portal: 'ComprasME', pregao: '42/03/4', uasg: '42303/4', totalVencido: 'R$ 0,00' },
    { cnpj: '10.797.693/0001-99', portal: 'ComprasME', pregao: '90/09/2024', uasg: '715633', totalVencido: 'R$ 0,00' },
    { cnpj: '10.797.693/0001-99', portal: 'ComprasME', pregao: '15/00/2024', uasg: '150000', totalVencido: 'R$ 0,00' },
  ];

  // Dados para os cards
  const cardData = [
    { id: 1, title: 'Cadastrados', value: monitoringItems.length.toString().padStart(2, '0'), icon: '📋' },
    { id: 2, title: 'Pregões vencidos', value: wonCount.toString().padStart(2, '0'), icon: '🏆' },
    { id: 3, title: 'Disputados', value: disputedCount.toString().padStart(2, '0'), icon: '👥' },
    { id: 4, title: 'Vencidos', value: wonCount.toString().padStart(2, '0'), icon: '💼' },
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
