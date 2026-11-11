import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquare, ExternalLink, ShieldAlert } from 'lucide-react';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import { PROPERTY_INFO } from '../../data/mockData';

export default function WhatsAppSimModal({ billing, tenant, onClose }) {
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!billing) return null;

  const phoneTarget = tenant?.phone || "08123456789";
  const messageText = `Halo Sdr/i ${billing.tenantName}, kami mengingatkan tagihan sewa bulanan Kos Srirahayu untuk Kamar ${billing.roomNumber} periode ${billing.period} sejumlah ${formatRupiah(billing.totalAmount)}. Jatuh tempo pembayaran pada tanggal ${formatDateIndo(billing.dueDate)}. Pembayaran dapat ditransfer ke ${PROPERTY_INFO.bankAccount.bank} no. rek ${PROPERTY_INFO.bankAccount.accountNumber} a.n ${PROPERTY_INFO.bankAccount.accountHolder}. Terima kasih atas kerjasamanya! 🙏`;

  const waWebUrl = `https://wa.me/${phoneTarget.replace(/^0/, '62')}?text=${encodeURIComponent(messageText)}`;

  const handleSimulateSend = () => {
    setSentSuccess(true);
    setTimeout(() => {
      // simulate auto close or keep open
    }, 2500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <span className="proto-badge badge-warning">SIMULASI RESMI SOT</span>
            <h3 className="modal-title mt-1">Pratinjau Pengingat WhatsApp</h3>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="sim-disclaimer-box">
            <ShieldAlert size={16} className="text-amber" />
            <p className="text-xs text-amber leading-relaxed">
              <strong>Ketentuan SOT:</strong> Integrasi WhatsApp ini berstatus <strong>SIMULASI</strong> untuk pengujian alur operasional tanpa credential/API berbayar pihak ketiga.
            </p>
          </div>

          <div className="sim-meta-row mt-3">
            <span className="text-xs text-muted">Penerima Pesan:</span>
            <span className="text-xs font-semibold text-slate-800">{billing.tenantName} ({phoneTarget})</span>
          </div>

          {/* WhatsApp Chat Preview Bubble */}
          <div className="wa-phone-screen mt-3">
            <div className="wa-chat-header">
              <div className="wa-avatar">KS</div>
              <div>
                <div className="wa-header-name">Admin Kos Srirahayu</div>
                <div className="wa-header-status">Online • Simulasi Gateway</div>
              </div>
            </div>

            <div className="wa-bubble-container">
              <div className="wa-bubble">
                <p className="wa-text">{messageText}</p>
                <div className="wa-time-meta">
                  <span>10:45</span>
                  <span className="wa-ticks">✓✓</span>
                </div>
              </div>
            </div>
          </div>

          {sentSuccess && (
            <div className="alert-success mt-3 animate-fade-in">
              <CheckCircle2 size={16} />
              <span>Simulasi notifikasi berhasil dieksekusi dan dicatat ke log sistem!</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <a 
            href={waWebUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <ExternalLink size={14} />
            Buka di WhatsApp Web (wa.me)
          </a>

          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={handleSimulateSend}
            disabled={sentSuccess}
          >
            <Send size={14} />
            {sentSuccess ? 'Notifikasi Terkirim (Tercatat)' : 'Kirim Simulasi'}
          </button>
        </div>
      </div>
    </div>
  );
}
