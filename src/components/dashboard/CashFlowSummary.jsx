import React from 'react';
import { TrendingUp, ArrowDownRight, ArrowUpRight, DollarSign, Wallet } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

export default function CashFlowSummary({ billings, expenses, history }) {
  // Hitung pemasukan bulan berjalan
  const totalInvoiced = billings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalCollected = billings.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.totalAmount, 0);
  const totalPending = billings.filter(b => b.status !== 'paid').reduce((sum, b) => sum + b.totalAmount, 0);

  // Hitung pengeluaran operasional
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Laba bersih operasional terealisasi
  const netIncome = totalCollected - totalExpense;

  // Max value for chart scaling
  const maxVal = history && history.length > 0 
    ? Math.max(...history.map(h => Math.max(h.income, h.expense)), 1) * 1.15 
    : 1000000;

  return (
    <div className="card cashflow-card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Arus Kas & Keuangan Bulanan</h3>
          <p className="card-subtitle">Pemasukan sewa vs pengeluaran operasional Kos Srirahayu</p>
        </div>
        <div className="financial-badge-group">
          <span className="badge badge-success">
            <ArrowUpRight size={14} />
            Pemasukan: {formatRupiah(totalCollected)}
          </span>
          <span className="badge badge-danger">
            <ArrowDownRight size={14} />
            Pengeluaran: {formatRupiah(totalExpense)}
          </span>
        </div>
      </div>

      <div className="card-body">
        {/* KPI Mini Grid */}
        <div className="cashflow-kpi-row">
          <div className="kpi-mini-card">
            <span className="kpi-label">Pemasukan Diterima (Lunas)</span>
            <span className="kpi-val text-emerald">{formatRupiah(totalCollected)}</span>
            <span className="kpi-desc">Dari target {formatRupiah(totalInvoiced)}</span>
          </div>

          <div className="kpi-mini-card">
            <span className="kpi-label">Piutang Tagihan Berjalan</span>
            <span className="kpi-val text-amber">{formatRupiah(totalPending)}</span>
            <span className="kpi-desc">Menunggu pembayaran & tempo</span>
          </div>

          <div className="kpi-mini-card">
            <span className="kpi-label">Biaya Operasional</span>
            <span className="kpi-val text-rose">{formatRupiah(totalExpense)}</span>
            <span className="kpi-desc">{expenses.length} pos pengeluaran tercatat</span>
          </div>

          <div className="kpi-mini-card highlight-card">
            <span className="kpi-label">Laba Bersih Operasional</span>
            <span className="kpi-val text-primary">{formatRupiah(netIncome)}</span>
            <span className="kpi-desc">Kas bersih saat ini</span>
          </div>
        </div>

        {/* 6-Month Trend Chart */}
        <div className="chart-container">
          <div className="chart-header">
            <span className="chart-title-text">Tren Pemasukan & Pengeluaran 6 Bulan Terakhir</span>
            {history && history.length > 0 && (
              <div className="chart-legend">
                <span className="chart-legend-item">
                  <span className="color-box bg-primary"></span>
                  <span>Pemasukan</span>
                </span>
                <span className="chart-legend-item">
                  <span className="color-box bg-rose"></span>
                  <span>Pengeluaran</span>
                </span>
              </div>
            )}
          </div>

          {!history || history.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 my-2">
              <TrendingUp size={36} className="mx-auto text-slate-400 mb-2" />
              <h4 className="font-bold text-slate-800 text-sm">Belum Ada Riwayat Transaksi</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Database dimulai dalam keadaan kosong (Zero-Data). Grafik tren arus kas akan otomatis terisi saat pembayaran tagihan dan pengeluaran operasional dicatat.
              </p>
            </div>
          ) : (
            <div className="bar-chart-wrap">
              {history.map((item, idx) => {
                const incomeHeight = Math.round((item.income / maxVal) * 100);
                const expenseHeight = Math.round((item.expense / maxVal) * 100);

                return (
                  <div key={idx} className="chart-column">
                    <div className="bars-pair">
                      <div 
                        className="bar-income" 
                        style={{ height: `${incomeHeight}%` }}
                        title={`Pemasukan: ${formatRupiah(item.income)}`}
                      >
                        <span className="bar-tooltip">{formatRupiah(item.income)}</span>
                      </div>
                      <div 
                        className="bar-expense" 
                        style={{ height: `${expenseHeight}%` }}
                        title={`Pengeluaran: ${formatRupiah(item.expense)}`}
                      >
                        <span className="bar-tooltip">{formatRupiah(item.expense)}</span>
                      </div>
                    </div>
                    <div className="chart-x-label">{item.month}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
