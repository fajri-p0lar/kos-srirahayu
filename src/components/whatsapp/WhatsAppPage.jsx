import React, { useState, useMemo, useEffect } from 'react';
import {
  MessageSquare, Bell, CheckCircle2, AlertTriangle, Clock, Send,
  X, ExternalLink, Phone, Receipt, History, Info, MessageCircle
} from 'lucide-react';
import { formatRupiah, formatDateIndo, getStatusBillingBadge } from '../../utils/formatters';
import { PROPERTY_INFO } from '../../data/mockData';

// ============================================================
// MODE UJI COBA: Set ke nomor tes untuk mengirim SEMUA pesan
// WhatsApp ke nomor ini (bukan ke nomor penghuni).
// Ubah ke null untuk kirim ke nomor penghuni yang sebenarnya.
// ============================================================
const TEST_PHONE = '085280769992';

export default function WhatsAppPage({
  billings = [],
  tenants = [],
  rooms = []
}) {
  const [activeTab, setActiveTab] = useState('reminders'); // 'reminders' | 'confirmations' | 'history'
  const [previewMsg, setPreviewMsg] = useState(null);
  const [notificationLog, setNotificationLog] = useState(() => {
    const saved = localStorage.getItem('srirahayu_db_wa_log');
    return saved ? JSON.parse(saved) : [];
  });

  // Simpan log notifikasi ke localStorage
  useEffect(() => {
    localStorage.setItem('srirahayu_db_wa_log', JSON.stringify(notificationLog));
  }, [notificationLog]);

  // Tagihan yang perlu pengingat (pending & overdue)
  const reminderBillings = useMemo(() => {
    return billings
      .filter((b) => b.status === 'pending' || b.status === 'overdue')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [billings]);

  // Tagihan yang sudah lunas (untuk konfirmasi)
  const paidBillings = useMemo(() => {
    return billings
      .filter((b) => b.status === 'paid')
      .sort((a, b) => new Date(b.paymentDate || b.createdAt) - new Date(a.paymentDate || a.createdAt));
  }, [billings]);

  // Generate pesan WhatsApp
  const generateReminderMessage = (billing, tenant) => {
    const statusLabel = billing.status === 'overdue' ? 'TERLAMBAT' : 'akan jatuh tempo';
    return `Halo ${billing.tenantName},\n\nIni pengingat tagihan sewa kamar ${billing.roomNumber} Kos Srirahayu:\n\n` +
      `Invoice: ${billing.invoiceNumber}\n` +
      `Periode: ${billing.period}\n` +
      `Total: ${formatRupiah(billing.totalAmount)}\n` +
      `Jatuh Tempo: ${formatDateIndo(billing.dueDate)} (${statusLabel})\n\n` +
      `Pembayaran via transfer ${PROPERTY_INFO.bankAccount.bank}:\n` +
      `${PROPERTY_INFO.bankAccount.accountNumber} a.n. ${PROPERTY_INFO.bankAccount.accountHolder}\n\n` +
      `Mohon segera lakukan pembayaran. Terima kasih.\n\n` +
      `- Pengelola Kos Srirahayu`;
  };

  const generateConfirmationMessage = (billing) => {
    return `Halo ${billing.tenantName},\n\n` +
      `Pembayaran tagihan Anda telah kami terima:\n\n` +
      `Invoice: ${billing.invoiceNumber}\n` +
      `Periode: ${billing.period}\n` +
      `Total: ${formatRupiah(billing.totalAmount)}\n` +
      `Tanggal Bayar: ${formatDateIndo(billing.paymentDate)}\n` +
      `Metode: ${billing.paymentMethod}\n\n` +
      `Terima kasih atas pembayarannya.\n\n` +
      `- Pengelola Kos Srirahayu`;
  };

  // Buka preview pesan
  const handlePreviewReminder = (billing) => {
    const tenant = tenants.find((t) => t.id === billing.tenantId);
    const message = generateReminderMessage(billing, tenant);
    const realPhone = tenant?.phone || billing.tenantPhone || '';
    const phone = TEST_PHONE || realPhone;
    setPreviewMsg({
      type: billing.status === 'overdue' ? 'Pengingat Terlambat' : 'Pengingat Jatuh Tempo',
      billing,
      phone,
      realPhone,
      message,
    });
  };

  const handlePreviewConfirmation = (billing) => {
    const message = generateConfirmationMessage(billing);
    const realPhone = billing.tenantPhone || tenants.find((t) => t.id === billing.tenantId)?.phone || '';
    const phone = TEST_PHONE || realPhone;
    setPreviewMsg({
      type: 'Konfirmasi Pembayaran',
      billing,
      phone,
      realPhone,
      message,
    });
  };

  // Kirim (simulasi) — catat ke log dan buka wa.me
  const handleSend = () => {
    if (!previewMsg) return;
    const logEntry = {
      id: `wa-${Date.now()}`,
      type: previewMsg.type,
      billingId: previewMsg.billing.id,
      invoiceNumber: previewMsg.billing.invoiceNumber,
      tenantName: previewMsg.billing.tenantName,
      phone: previewMsg.phone,
      message: previewMsg.message,
      status: 'simulasi',
      sentAt: new Date().toISOString(),
    };
    setNotificationLog([logEntry, ...notificationLog]);

    // Buka wa.me link
    const waUrl = `https://wa.me/${previewMsg.phone.replace(/^0/, '62')}?text=${encodeURIComponent(previewMsg.message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setPreviewMsg(null);
  };

  // KPI Stats
  const pendingCount = billings.filter((b) => b.status === 'pending').length;
  const overdueCount = billings.filter((b) => b.status === 'overdue').length;
  const sentCount = notificationLog.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="module-header-banner">
        <div className="module-header-info">
          <div className="module-header-icon" style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}>
            <MessageSquare size={26} />
          </div>
          <div>
            <h2 className="module-header-title">Notifikasi WhatsApp</h2>
            <p className="module-header-desc">
              Pengingat tagihan &amp; konfirmasi pembayaran via WhatsApp
            </p>
          </div>
        </div>
        <div className="module-header-actions">
          <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', background: 'rgba(255, 251, 235, 0.15)', color: '#fde68a', border: '1px solid rgba(253, 230, 138, 0.25)' }}>
            Simulasi
          </span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="tenant-stats-grid">
        <div className="tenant-stat-card">
          <div className="tenant-stat-icon" style={{ background: 'var(--amber-50)' }}>
            <Clock size={22} style={{ color: 'var(--amber-600)' }} />
          </div>
          <div>
            <div className="tenant-stat-value">{pendingCount}</div>
            <div className="tenant-stat-label">Menunggu Pengingat</div>
          </div>
        </div>
        <div className="tenant-stat-card">
          <div className="tenant-stat-icon" style={{ background: 'var(--rose-50)' }}>
            <AlertTriangle size={22} style={{ color: 'var(--rose-600)' }} />
          </div>
          <div>
            <div className="tenant-stat-value">{overdueCount}</div>
            <div className="tenant-stat-label">Terlambat</div>
          </div>
        </div>
        <div className="tenant-stat-card">
          <div className="tenant-stat-icon" style={{ background: 'var(--emerald-50)' }}>
            <CheckCircle2 size={22} style={{ color: 'var(--emerald-600)' }} />
          </div>
          <div>
            <div className="tenant-stat-value">{paidBillings.length}</div>
            <div className="tenant-stat-label">Siap Konfirmasi</div>
          </div>
        </div>
        <div className="tenant-stat-card">
          <div className="tenant-stat-icon" style={{ background: 'var(--primary-50)' }}>
            <Send size={22} style={{ color: 'var(--primary-600)' }} />
          </div>
          <div>
            <div className="tenant-stat-value">{sentCount}</div>
            <div className="tenant-stat-label">Notifikasi Terkirim</div>
          </div>
        </div>
      </div>

      {/* Simulasi Notice */}
      <div style={{ padding: '0.875rem 1.125rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.8125rem', color: '#92400e' }}>
        <Info size={16} className="shrink-0" />
        <span>
          <strong>Catatan SOT:</strong> Modul ini berjalan dalam mode simulasi. Pesan tidak terkirim otomatis via API berbayar.
          Tombol "Kirim" akan membuka link <strong>wa.me</strong> langsung ke WhatsApp pengelola untuk diteruskan secara manual.
          Semua aktivitas tercatat di log notifikasi sebagai bukti.
        </span>
      </div>

      {/* Mode Uji Coba Notice */}
      {TEST_PHONE && (
        <div style={{ padding: '0.875rem 1.125rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.8125rem', color: '#1e40af' }}>
          <Phone size={16} className="shrink-0" />
          <span>
            <strong>Mode Uji Coba Aktif:</strong> Semua pesan akan dikirim ke nomor tes <strong>{TEST_PHONE}</strong> (bukan nomor penghuni sebenarnya).
            Ubah <code style={{ background: 'rgba(255,255,255,0.5)', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>TEST_PHONE</code> ke <code style={{ background: 'rgba(255,255,255,0.5)', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>null</code> di <code style={{ background: 'rgba(255,255,255,0.5)', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>WhatsAppPage.jsx</code> untuk kirim ke penghuni.
          </span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tenant-tabs">
        <button type="button" className={`tenant-tab-btn ${activeTab === 'reminders' ? 'active' : ''}`} onClick={() => setActiveTab('reminders')}>
          <Bell size={15} /> Pengingat Tagihan
          <span className="tenant-tab-count">{reminderBillings.length}</span>
        </button>
        <button type="button" className={`tenant-tab-btn ${activeTab === 'confirmations' ? 'active' : ''}`} onClick={() => setActiveTab('confirmations')}>
          <CheckCircle2 size={15} /> Konfirmasi Pembayaran
          <span className="tenant-tab-count">{paidBillings.length}</span>
        </button>
        <button type="button" className={`tenant-tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          <History size={15} /> Riwayat Notifikasi
          <span className="tenant-tab-count">{notificationLog.length}</span>
        </button>
      </div>

      {/* ===== TAB: PENGINGAT TAGIHAN ===== */}
      {activeTab === 'reminders' && (
        <div className="tenant-table-wrap">
          {reminderBillings.length === 0 ? (
            <div className="tenant-empty">
              <Bell size={40} style={{ color: 'var(--slate-300)', margin: '0 auto' }} />
              <h3>Tidak Ada Tagihan Perlu Pengingat</h3>
              <p>Semua tagihan sudah lunas atau belum ada tagihan yang dibuat.</p>
            </div>
          ) : (
            <table className="tenant-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Penghuni</th>
                  <th>Kamar</th>
                  <th>Total</th>
                  <th>Jatuh Tempo</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {reminderBillings.map((b) => {
                  const badge = getStatusBillingBadge(b.status);
                  return (
                    <tr key={b.id}>
                      <td><span className="billing-invoice-code">{b.invoiceNumber}</span></td>
                      <td className="tenant-name-cell">{b.tenantName}</td>
                      <td><span className="room-pill">Kamar {b.roomNumber}</span></td>
                      <td><span className="billing-amount unpaid">{formatRupiah(b.totalAmount)}</span></td>
                      <td style={{ fontSize: '0.8125rem' }}>{formatDateIndo(b.dueDate)}</td>
                      <td>
                        <span className={`badge ${badge.className}`}>
                          <span className="badge-dot" style={{ backgroundColor: badge.dotColor }} />
                          {badge.label}
                        </span>
                      </td>
                      <td>
                        <div className="tenant-action-btns">
                          <button type="button" className="tenant-action-btn success" onClick={() => handlePreviewReminder(b)} title="Kirim Pengingat WhatsApp">
                            <MessageCircle size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ===== TAB: KONFIRMASI PEMBAYARAN ===== */}
      {activeTab === 'confirmations' && (
        <div className="tenant-table-wrap">
          {paidBillings.length === 0 ? (
            <div className="tenant-empty">
              <CheckCircle2 size={40} style={{ color: 'var(--slate-300)', margin: '0 auto' }} />
              <h3>Belum Ada Pembayaran Dikonfirmasi</h3>
              <p>Konfirmasi pembayaran via WhatsApp akan muncul setelah tagihan ditandai lunas.</p>
            </div>
          ) : (
            <table className="tenant-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Penghuni</th>
                  <th>Kamar</th>
                  <th>Total</th>
                  <th>Tanggal Bayar</th>
                  <th>Metode</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paidBillings.map((b) => (
                  <tr key={b.id}>
                    <td><span className="billing-invoice-code">{b.invoiceNumber}</span></td>
                    <td className="tenant-name-cell">{b.tenantName}</td>
                    <td><span className="room-pill">Kamar {b.roomNumber}</span></td>
                    <td><span className="billing-amount">{formatRupiah(b.totalAmount)}</span></td>
                    <td style={{ fontSize: '0.8125rem' }}>{formatDateIndo(b.paymentDate)}</td>
                    <td style={{ fontSize: '0.8125rem' }}>{b.paymentMethod}</td>
                    <td>
                      <div className="tenant-action-btns">
                        <button type="button" className="tenant-action-btn success" onClick={() => handlePreviewConfirmation(b)} title="Kirim Konfirmasi WhatsApp">
                          <MessageCircle size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ===== TAB: RIWAYAT NOTIFIKASI ===== */}
      {activeTab === 'history' && (
        <div className="tenant-table-wrap">
          {notificationLog.length === 0 ? (
            <div className="tenant-empty">
              <History size={40} style={{ color: 'var(--slate-300)', margin: '0 auto' }} />
              <h3>Belum Ada Notifikasi Terkirim</h3>
              <p>Riwayat notifikasi WhatsApp (simulasi) akan muncul di sini setelah Anda mengirim pengingat atau konfirmasi.</p>
            </div>
          ) : (
            <table className="tenant-table">
              <thead>
                <tr>
                  <th>Waktu Kirim</th>
                  <th>Jenis</th>
                  <th>Invoice</th>
                  <th>Penghuni</th>
                  <th>Nomor WA</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {notificationLog.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.8125rem' }}>{formatDateIndo(log.sentAt.split('T')[0])} {new Date(log.sentAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', background: log.type.includes('Terlambat') ? 'var(--rose-50)' : log.type.includes('Konfirmasi') ? 'var(--emerald-50)' : 'var(--amber-50)', color: log.type.includes('Terlambat') ? 'var(--rose-700)' : log.type.includes('Konfirmasi') ? 'var(--emerald-700)' : 'var(--amber-700)' }}>
                        {log.type}
                      </span>
                    </td>
                    <td><span className="billing-invoice-code">{log.invoiceNumber}</span></td>
                    <td className="tenant-name-cell">{log.tenantName}</td>
                    <td style={{ fontSize: '0.8125rem' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><Phone size={12} className="text-slate-400" />{log.phone}</span></td>
                    <td>
                      <span className="badge badge-warning">
                        <span className="badge-dot" style={{ backgroundColor: '#f59e0b' }} />
                        Simulasi
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ===== MODAL: PREVIEW PESAN WHATSAPP ===== */}
      {previewMsg && (
        <div className="modal-overlay" onClick={() => setPreviewMsg(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <div className="modal-title">
                <MessageCircle size={20} style={{ color: '#25D366' }} />
                <span>{previewMsg.type}</span>
              </div>
              <button type="button" className="btn-icon" onClick={() => setPreviewMsg(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '1.5rem' }}>
              {/* Info penerima */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.875rem', background: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#128C7E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.875rem' }}>
                  {previewMsg.billing.tenantName?.charAt(0) || '?'}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--slate-900)' }}>{previewMsg.billing.tenantName}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                    {TEST_PHONE ? (
                      <>
                        <span style={{ fontWeight: 700, color: 'var(--amber-700)' }}>Mode Uji Coba → {TEST_PHONE}</span>
                        {previewMsg.realPhone && <span style={{ color: 'var(--slate-400)' }}> (asli: {previewMsg.realPhone})</span>}
                      </>
                    ) : (
                      previewMsg.phone || 'No. WA tidak tersedia'
                    )}
                  </p>
                </div>
              </div>

              {/* Preview pesan */}
              <label className="form-label"><span>Pratinjau Pesan</span></label>
              <div style={{ background: '#efeae2', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '0.75rem', border: '1px solid #d1d7db' }}>
                <div style={{ background: '#e7ffdb', borderRadius: '10px 0 10px 10px', padding: '0.75rem 1rem', maxWidth: '95%', fontSize: '0.8125rem', color: '#111b21', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {previewMsg.message}
                </div>
              </div>

              <div className="sim-disclaimer-box" style={{ marginBottom: 0 }}>
                <Info size={15} className="text-amber-500 shrink-0" />
                <span style={{ fontSize: '0.75rem', color: '#92400e' }}>
                  Simulasi: Tombol "Kirim via WhatsApp" akan membuka aplikasi WhatsApp dengan pesan dan nomor tujuan sudah terisi. Pengelola tinggal menekan tombol kirim di WhatsApp.
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setPreviewMsg(null)}>Batal</button>
              <button type="button" className="btn btn-primary" onClick={handleSend} disabled={!previewMsg.phone}>
                <Send size={16} />
                <span>Kirim via WhatsApp</span>
                <ExternalLink size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
