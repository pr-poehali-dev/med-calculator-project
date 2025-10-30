import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HealthRecord {
  id: string;
  date: string;
  type: 'bmi' | 'calories' | 'pressure' | 'sugar' | 'cholesterol';
  value: number | string;
  additionalData?: any;
}

interface HistoryViewProps {
  history: HealthRecord[];
  onClearHistory: () => void;
}

export const HistoryView = ({ history, onClearHistory }: HistoryViewProps) => {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2 font-heading">
            История расчётов
          </h2>
          <p className="text-gray-600">Все ваши измерения сохраняются локально</p>
        </div>
        {history.length > 0 && (
          <Button variant="destructive" onClick={onClearHistory}>
            <Icon name="Trash2" size={18} className="mr-2" />
            Очистить историю
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Icon name="History" className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-xl text-gray-600">История пуста</p>
            <p className="text-sm text-gray-400 mt-2">Начните делать расчёты, чтобы увидеть историю</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((record) => (
            <Card key={record.id} className="hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      record.type === 'bmi' ? 'bg-primary/10' :
                      record.type === 'calories' ? 'bg-secondary/10' :
                      record.type === 'pressure' ? 'bg-red-500/10' :
                      record.type === 'sugar' ? 'bg-yellow-500/10' :
                      'bg-purple-500/10'
                    }`}>
                      <Icon 
                        name={
                          record.type === 'bmi' ? 'Scale' :
                          record.type === 'calories' ? 'Flame' :
                          record.type === 'pressure' ? 'Heart' :
                          record.type === 'sugar' ? 'Droplet' :
                          'TrendingUp'
                        }
                        className={
                          record.type === 'bmi' ? 'text-primary' :
                          record.type === 'calories' ? 'text-secondary' :
                          record.type === 'pressure' ? 'text-red-500' :
                          record.type === 'sugar' ? 'text-yellow-500' :
                          'text-purple-500'
                        }
                        size={24}
                      />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {record.type === 'bmi' && 'ИМТ'}
                        {record.type === 'calories' && 'Калории'}
                        {record.type === 'pressure' && 'Давление'}
                        {record.type === 'sugar' && 'Сахар'}
                        {record.type === 'cholesterol' && 'Холестерин'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(record.date).toLocaleString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {record.value}
                      {record.type === 'calories' && ' ккал'}
                      {record.type === 'sugar' && ' ммоль/л'}
                      {record.type === 'cholesterol' && ' ммоль/л'}
                    </p>
                    {record.additionalData?.result && (
                      <p className="text-xs text-gray-500 mt-1">{record.additionalData.result}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
