import { useState } from 'react';

type Step = {
    date: string;
    distance: number;
};

const Steps = () => {
    const [form, setForm] = useState({ date: '', distance: '' });
    const [steps, setSteps] = useState<Step[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const isValidDate = (dateStr: string): boolean => {
        const [day, month, year] = dateStr.split('.').map(Number);

        if (!day || !month || !year) return false;

        const date = new Date(year, month - 1, day);

        // Проверка: созданная дата должна соответствовать введённой
        return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const { date, distance } = form;
        const parsedDistance = parseFloat(distance);
        const datePattern = /^\d{2}\.\d{2}\.\d{4}$/;

        if (!datePattern.test(date)) {
            alert('Введите дату в формате ДД.ММ.ГГГГ, используя точки.');
            return;
        }

        if (!isValidDate(date)) {
            alert('Такой даты не существует. Пожалуйста, проверьте правильность.');
            return;
        }

        if (isNaN(parsedDistance)) return;

        setSteps(prev => {
            const existing = prev.find(step => step.date === date);

            if (existing) {
                return prev
                    .map(step =>
                        step.date === date
                            ? { ...step, distance: step.distance + parsedDistance }
                            : step
                    )
                    .sort((a, b) => {
                        const [d1, m1, y1] = a.date.split('.').map(Number);
                        const [d2, m2, y2] = b.date.split('.').map(Number);
                        return new Date(y2, m2 - 1, d2).getTime() - new Date(y1, m1 - 1, d1).getTime();
                    });
            } else {
                return [...prev, { date, distance: parsedDistance }].sort((a, b) => {
                    const [d1, m1, y1] = a.date.split('.').map(Number);
                    const [d2, m2, y2] = b.date.split('.').map(Number);
                    return new Date(y2, m2 - 1, d2).getTime() - new Date(y1, m1 - 1, d1).getTime();
                });
            }
        });

        setForm({ date: '', distance: '' });
    };

    const handleDelete = (date: string) => {
        setSteps(prev => prev.filter(step => step.date !== date));
    };

    return (
        <div className="steps-container">
            <form onSubmit={handleSubmit} className="steps-form-grid">
                <label htmlFor="date">Дата (ДД.ММ.ГГГГ)</label>
                <label htmlFor="distance">Пройдено км</label>
                <div></div> {/* пустая ячейка для выравнивания кнопки */}

                <input
                    type="text"
                    id="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    placeholder='01.01.2000'
                />
                <input
                    type="number"
                    id="distance"
                    name="distance"
                    value={form.distance}
                    onChange={handleChange}
                    step="0.1"
                />
                <button type="submit">ОК</button>
            </form>

            <table className="steps-table">
                <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Пройдено км</th>
                        <th>Удалить</th>
                    </tr>
                </thead>
                <tbody className="steps-table-body">
                    {steps.map((step) => (
                        <tr key={step.date}>
                            <td>{step.date}</td>
                            <td>{step.distance.toFixed(1)}</td>
                            <td>
                                <span className="delete-btn" onClick={() => handleDelete(step.date)}>✘</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Steps;