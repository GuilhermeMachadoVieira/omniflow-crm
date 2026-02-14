import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Página Não Encontrada</h1>
        <p className="text-gray-600 mb-8">A página que você está procurando não existe.</p>
        <Link 
          href="/" 
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors inline-block"
        >
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
}
