
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, Cell, Bar, XAxis, YAxis, Tooltip, Legend, Pie, ResponsiveContainer } from 'recharts';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

const Report: React.FC = () => {
  // Dados da tabela
  const tableData = [
    {
      date: '12/03/2024',
      auction: 'PE-54/2024',
      portal: 'ComprasNet',
      institution: 'Ministério da Economia',
      value: 45000,
      status: 'Vencido',
      statusClass: 'bg-green-100 text-green-800'
    },
    {
      date: '23/03/2024',
      auction: 'PE-78/2024',
      portal: 'BEC',
      institution: 'Tribunal Regional Federal',
      value: 23450,
      status: 'Perdido',
      statusClass: 'bg-red-100 text-red-800'
    },
    {
      date: '28/03/2024',
      auction: 'PE-32/2024',
      portal: 'ComprasNet',
      institution: 'Ministério da Saúde',
      value: 67890,
      status: 'Em Andamento',
      statusClass: 'bg-yellow-100 text-yellow-800'
    },
    {
      date: '01/04/2024',
      auction: 'PE-12/2024',
      portal: 'Gov.br',
      institution: 'Universidade Federal',
      value: 98765,
      status: 'Suspenso',
      statusClass: 'bg-blue-100 text-blue-800'
    },
    {
      date: '05/04/2024',
      auction: 'PE-45/2024',
      portal: 'ComprasNet',
      institution: 'Exército Brasileiro',
      value: 34500,
      status: 'Vencido',
      statusClass: 'bg-green-100 text-green-800'
    }
  ];
  
  // Dados para o gráfico de barras - extraídos da tabela
  const barChartData = useMemo(() => {
    const months = [
      'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 
      'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'
    ];
    
    // Criar objeto para armazenar contagens por mês
    const monthlyCounts = {};
    months.forEach(month => {
      monthlyCounts[month] = 0;
    });
    
    // Contar participações por mês
    tableData.forEach(item => {
      const [day, month, year] = item.date.split('/');
      const monthIndex = parseInt(month) - 1;
      const monthAbbr = months[monthIndex];
      monthlyCounts[monthAbbr]++;
    });
    
    // Converter para o formato esperado pelo gráfico
    return months.map(month => ({
      name: month,
      value: monthlyCounts[month]
    }));
  }, [tableData]);
  
  // Dados para o gráfico de pizza - extraídos da tabela
  const pieChartData = useMemo(() => {
    // Contar participações por portal
    const portalCounts = {};
    tableData.forEach(item => {
      if (!portalCounts[item.portal]) {
        portalCounts[item.portal] = 0;
      }
      portalCounts[item.portal]++;
    });
    
    // Cores para cada portal
    const portalColors = {
      'ComprasNet': '#006837',
      'BEC': '#419873',
      'Gov.br': '#7DC9AA',
      'Outros': '#C0E6D2'
    };
    
    // Converter para o formato esperado pelo gráfico
    return Object.keys(portalCounts).map(portal => ({
      name: portal,
      value: portalCounts[portal],
      color: portalColors[portal] || portalColors['Outros']
    }));
  }, [tableData]);
  
  // Calculando valor total de participações
  const totalValue = useMemo(() => {
    return tableData.reduce((sum, item) => sum + item.value, 0);
  }, [tableData]);
  
  // Calculando número de participações vencidas
  const wonParticipations = useMemo(() => {
    return tableData.filter(item => item.status === 'Vencido').length;
  }, [tableData]);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Relatórios</h2>
      
      {/* Cards resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Participações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tableData.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Participações Vencidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wonParticipations}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Sucesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((wonParticipations / tableData.length) * 100).toFixed(0)}%
            </div>
          </CardContent>
        </Card>
      </div>
      
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Pregão</TableHead>
                    <TableHead>Portal</TableHead>
                    <TableHead>Órgão</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((item, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.auction}</TableCell>
                      <TableCell>{item.portal}</TableCell>
                      <TableCell>{item.institution}</TableCell>
                      <TableCell className="text-right">
                        R$ {item.value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${item.statusClass}`}>
                          {item.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Report;
