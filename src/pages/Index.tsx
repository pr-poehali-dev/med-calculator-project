import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { BMICalculator } from '@/components/calculators/BMICalculator';
import { CaloriesCalculator } from '@/components/calculators/CaloriesCalculator';
import { DosageCalculator } from '@/components/calculators/DosageCalculator';
import { PressureCalculator } from '@/components/calculators/PressureCalculator';
import { SugarCalculator } from '@/components/calculators/SugarCalculator';
import { CholesterolCalculator } from '@/components/calculators/CholesterolCalculator';
import { HistoryView } from '@/components/HistoryView';
import { ChartsView } from '@/components/ChartsView';

interface HealthRecord {
  id: string;
  date: string;
  type: 'bmi' | 'calories' | 'pressure' | 'sugar' | 'cholesterol';
  value: number | string;
  additionalData?: any;
}

const Index = () => {
  const [history, setHistory] = useState<HealthRecord[]>([]);
  const [activeTab, setActiveTab] = useState('calculators');

  useEffect(() => {
    const savedHistory = localStorage.getItem('healthHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (record: Omit<HealthRecord, 'id' | 'date'>) => {
    const newRecord: HealthRecord = {
      ...record,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    const updatedHistory = [newRecord, ...history].slice(0, 100);
    setHistory(updatedHistory);
    localStorage.setItem('healthHistory', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('healthHistory');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Activity" className="text-primary" size={32} />
              <h1 className="text-2xl font-bold text-primary font-heading">МедКалькулятор</h1>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => setActiveTab('calculators')} className="text-gray-700 hover:text-primary transition-colors flex items-center gap-2">
                <Icon name="Calculator" size={20} />
                Калькуляторы
              </button>
              <button onClick={() => setActiveTab('history')} className="text-gray-700 hover:text-primary transition-colors flex items-center gap-2">
                <Icon name="History" size={20} />
                История
              </button>
              <button onClick={() => setActiveTab('charts')} className="text-gray-700 hover:text-primary transition-colors flex items-center gap-2">
                <Icon name="LineChart" size={20} />
                Графики
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        {activeTab === 'calculators' && (
          <>
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-5xl font-bold text-gray-900 mb-4 font-heading">
                Медицинские калькуляторы
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Быстрые и точные расчёты для здоровья и медицинских назначений
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <BMICalculator onSave={saveToHistory} />
              <CaloriesCalculator onSave={saveToHistory} />
              <DosageCalculator />
              <PressureCalculator onSave={saveToHistory} />
              <SugarCalculator onSave={saveToHistory} />
              <CholesterolCalculator onSave={saveToHistory} />
            </div>

            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-none">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3 font-heading">Нужна консультация?</h3>
                    <p className="text-gray-600 mb-4">
                      Наши калькуляторы предоставляют ориентировочные значения. 
                      Для точной диагностики и назначения лечения обратитесь к врачу.
                    </p>
                    <Button size="lg" className="gap-2">
                      <Icon name="Phone" size={18} />
                      Связаться с нами
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white/50 p-4 rounded-lg">
                      <Icon name="Users" className="mx-auto text-primary mb-2" size={32} />
                      <p className="text-2xl font-bold text-primary font-heading">12К+</p>
                      <p className="text-xs text-gray-600">Пользователей</p>
                    </div>
                    <div className="bg-white/50 p-4 rounded-lg">
                      <Icon name="Calculator" className="mx-auto text-secondary mb-2" size={32} />
                      <p className="text-2xl font-bold text-secondary font-heading">50К+</p>
                      <p className="text-xs text-gray-600">Расчётов</p>
                    </div>
                    <div className="bg-white/50 p-4 rounded-lg">
                      <Icon name="Star" className="mx-auto text-accent mb-2" size={32} />
                      <p className="text-2xl font-bold text-accent font-heading">4.9</p>
                      <p className="text-xs text-gray-600">Рейтинг</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'history' && (
          <HistoryView history={history} onClearHistory={clearHistory} />
        )}

        {activeTab === 'charts' && (
          <ChartsView history={history} />
        )}
      </main>

      <footer className="bg-gray-900 text-white mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Activity" size={24} />
                <h3 className="text-xl font-bold font-heading">МедКалькулятор</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Современные медицинские калькуляторы для вашего здоровья
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 font-heading">Разделы</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setActiveTab('calculators')} className="hover:text-white transition-colors">Калькуляторы</button></li>
                <li><button onClick={() => setActiveTab('history')} className="hover:text-white transition-colors">История</button></li>
                <li><button onClick={() => setActiveTab('charts')} className="hover:text-white transition-colors">Графики</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 font-heading">Поддержка</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Вопросы и ответы</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
                <li><a href="#" className="hover:text-white transition-colors">О проекте</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 font-heading">Контакты</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  info@medcalc.ru
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  +7 (495) 123-45-67
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>© 2024 МедКалькулятор. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
