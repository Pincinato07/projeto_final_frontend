import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Tag, Users } from "lucide-react"

export default async function PainelHomePage() {
  const stats = [
    {
      title: "Total de Produtos",
      value: "125",
      icon: <Package className="h-5 w-5 text-blue-500" />,
      description: "+12% em relação ao mês passado",
      color: "bg-blue-100 dark:bg-blue-900/50"
    },
    {
      title: "Pedidos Hoje",
      value: "28",
      icon: <ShoppingCart className="h-5 w-5 text-emerald-500" />,
      description: "+5% em relação a ontem",
      color: "bg-emerald-100 dark:bg-emerald-900/50"
    },
    {
      title: "Categorias Ativas",
      value: "15",
      icon: <Tag className="h-5 w-5 text-amber-500" />,
      description: "3 novas esta semana",
      color: "bg-amber-100 dark:bg-amber-900/50"
    },
    {
      title: "Clientes Novos",
      value: "42",
      icon: <Users className="h-5 w-5 text-violet-500" />,
      description: "+8% em relação à semana passada",
      color: "bg-violet-100 dark:bg-violet-900/50"
    }
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
        <p className="text-muted-foreground">Acompanhe as métricas e estatísticas do seu negócio.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`${stat.color} p-2 rounded-md`}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Atividade {item}</p>
                    <p className="text-xs text-muted-foreground">Há {item} hora{item > 1 ? 's' : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <button className="flex items-center justify-between rounded-md border border-border/50 p-4 hover:bg-accent transition-colors text-left">
                <div>
                  <p className="font-medium">Adicionar Novo Produto</p>
                  <p className="text-sm text-muted-foreground">Cadastre um novo item no catálogo</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </button>
              <button className="flex items-center justify-between rounded-md border border-border/50 p-4 hover:bg-accent transition-colors text-left">
                <div>
                  <p className="font-medium">Ver Relatórios</p>
                  <p className="text-sm text-muted-foreground">Acesse relatórios detalhados</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                  <path d="M3 3v18h18" />
                  <path d="m19 9-5 5-4-4-3 3" />
                </svg>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
