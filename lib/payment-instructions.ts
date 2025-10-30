export function getPaymentInstructions(method: string, orderNumber: string): string {
  switch (method) {
    case "bank_transfer":
    case "virement":
    case "virement_bancaire":
      return `
        <div style="background: #f0f9f4; padding: 20px; border-radius: 8px; border-left: 4px solid #2d5a3d;">
          <h3 style="margin-top: 0; color: #2d5a3d;">Virement bancaire (IBAN)</h3>
          <p>Merci d'effectuer le virement sur le compte suivant :</p>
          <p><strong>IBAN :</strong> [VOTRE_IBAN_ICI]</p>
          <p><strong>Nom du bénéficiaire :</strong> [VOTRE_NOM_ICI]</p>
          <p><strong>Référence à indiquer :</strong> ${orderNumber}</p>
          <p>Votre commande sera expédiée après réception du paiement.</p>
        </div>
      `;
    case "paylib":
      return `
        <div style="background: #f0f9f4; padding: 20px; border-radius: 8px; border-left: 4px solid #2d5a3d;">
          <h3 style="margin-top: 0; color: #2d5a3d;">Paylib</h3>
          <p>Merci d'envoyer le paiement via Paylib à [VOTRE_NUMERO_PAYLIB].</p>
          <p><strong>Référence à indiquer :</strong> ${orderNumber}</p>
        </div>
      `;
    case "lydia":
      return `
        <div style="background: #f0f9f4; padding: 20px; border-radius: 8px; border-left: 4px solid #2d5a3d;">
          <h3 style="margin-top: 0; color: #2d5a3d;">Lydia</h3>
          <p>Merci d'envoyer le paiement via Lydia à [VOTRE_LYDIA].</p>
          <p><strong>Référence à indiquer :</strong> ${orderNumber}</p>
        </div>
      `;
    case "revolut":
      return `
        <div style="background: #f0f9f4; padding: 20px; border-radius: 8px; border-left: 4px solid #2d5a3d;">
          <h3 style="margin-top: 0; color: #2d5a3d;">Revolut</h3>
          <p>Merci d'envoyer le paiement via Revolut à [VOTRE_REVOULT].</p>
          <p><strong>Référence à indiquer :</strong> ${orderNumber}</p>
        </div>
      `;
    case "paypal":
      return `
        <div style="background: #f0f9f4; padding: 20px; border-radius: 8px; border-left: 4px solid #2d5a3d;">
          <h3 style="margin-top: 0; color: #2d5a3d;">PayPal</h3>
          <p>Merci d'envoyer le paiement à [VOTRE_EMAIL_PAYPAL].<br>Des frais de 3% sont appliqués.</p>
          <p><strong>Référence à indiquer :</strong> ${orderNumber}</p>
        </div>
      `;
    default:
      return `
        <div style="background: #f0f9f4; padding: 20px; border-radius: 8px; border-left: 4px solid #2d5a3d;">
          <h3 style="margin-top: 0; color: #2d5a3d;">Autre mode de paiement</h3>
          <p>Merci de nous contacter pour convenir du mode de paiement.</p>
          <p><strong>Référence à indiquer :</strong> ${orderNumber}</p>
        </div>
      `;
  }
}