import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { emailTemplates } from '../application/types/emailTypes';
import { EmailPayload } from '@blc-mono/members/application/models/emailModel';

export async function getEmailTemplate(
  bucketName: string,
  brand: string,
  emailType: string,
  payload: EmailPayload,
) {
  const s3 = new S3Client();
  if (!emailTypes[brand].hasOwnProperty(emailType)) {
    return undefined;
  }

  try {
    const key = emailTypes[brand][emailType];
    const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
    const response = await s3.send(command);
    if (response.Body) {
      const htmlContent = await response.Body.transformToString();

      let processedTemplate = htmlContent;
      for (const [key, value] of Object.entries(payload.content)) {
        processedTemplate = processedTemplate.replace(`{{${key}}}`, value);
      }
      return processedTemplate;
    }
  } catch (error) {
    console.error('Error retrieving template:', error);
    return undefined;
  }
}

export const emailTypes: emailTemplates = {
  blcuk: {
    // request action from user //
    activation_email: 'activation_email.html', // verify email - link needs updating
    activation_reminder: 'activation_reminder.html', // reminder to verify your email - link needs updating
    incorrect_address_reminder: 'incorrect_address_reminder.html', // bit confused by this one, seems to be reminding again about an address update, but also mentions you accidently put a home address????
    validate_renewal: 'validateRenewal.html', // i think this is for retired renewal as it says you do not need to upload id, possibly deprecate though?
    verify_new_email: 'verify_new_email.html', // changed email so validate this one (needs to be updated as hits validate.php)

    // actions to account //
    account_suspended: 'account_suspended.html', // we have just suspended your account
    approve_account_after_checks: 'approve_account_after_checks.html', // confirmed maybe? genie stuff, if not in, can deprecate?
    card_posted: 'card_posted.html', //sent when card is posted
    expire_card: 'expire_card.html', // sent when a card expires - my card bit needs updating as sends to highstreetcard.php
    id_approved: 'ID_approved.html', // general id approved, also contains if not paid pay here which might need to be updated - highstreetcard.php
    virtual_card_enabled: 'virtual_card_enabled.html', // email to say you can use your virtual card
    payment_made: 'payment_made.html', // email thats sent when someone pays - mentions that id will need to be approved (does id approve need to happen before payment so could be confusing?)
    promo_payment: 'promo_payment.html', // email thats sent for promocode - mentions uploading id though
    renew_expired: 'renew_expired.html', // renew reminder? sends to highstreedcard.php

    //declines
    decline_dental: 'dental_questions.html', // dentists require extra id??? link would need updating if still need, sends to https://www.bluelightcard.co.uk/contactblc.php
    // decline based on reason? not sure why it says auto
    id_decline_auto_email_name_doesnt_match: 'id-decline-auto-email-name-doesnt-match.html',
    id_decline_automated_email_file_password_protected:
      'id-decline-automated-email-file-password-protected.html',
    id_decline_council_contract_needed: 'id-decline-council-contract-needed.html',
    id_decline_paper_id_card: 'id-decline-paper-id-card.html',
    id_decline_address: 'reject_application_address.html', // rejection based on work address entered? not sure where this would be
    id_decline_blurry: 'reject_application_blurry.html', // blurry decline, links need updating, one goes to AU and one is highstreetcard.php
    id_decline_date: 'reject_application_date.html', // date not shown or not within last 3 months decline
    id_decline_drivers: 'reject_application_drivers.html', // decline because uploaded driving licence or passport
    id_decline_final: 'reject_application_final.html', // decline based on too many tries to fix previous declines
    id_decline_generic: 'reject_application_generic.html', // generic decline for id
    id_decline_invalid: 'reject_application_invalid.html', // decline as id is incorrect or does not meet requirements...
    id_decline_selfie: 'reject_application_selfie.html', // decline based on selfie uploaded
    // delcine based on service
    id_decline_Ambulance: 'ID-declined-Ambulance.html',
    id_decline_APHA: 'ID-declined-APHA.html',
    id_decline_Blood_Bikes: 'ID-declined-Blood-Bikes.html',
    id_decline_Environmental_Agency: 'ID-declined-Environmental-Agency.html',
    id_decline_Fire_Service_Retired_Firefighter:
      'ID-declined-Fire-Service-Retired-Firefighter.html',
    id_decline_Fire_Service: 'ID-declined-Fire-Service.html',
    id_decline_Highways_Traffic_Officers: 'ID-declined-Highways-Traffic-Officers.html',
    id_decline_HM_Armed_Forces_Veterans: 'ID-declined-HM-Armed-Forces-Veterans.html',
    id_decline_HM_Armed_Forces: 'ID-declined-HM-Armed-Forces.html',
    id_decline_HM_Coastguard: 'ID-declined-HM-Coastguard.html',
    id_decline_HM_Prison_and_Probation: 'ID-declined-HM-Prison-and-Probation.html',
    id_decline_Home_Office_Orders_and_Immigration:
      'ID-declined-Home-Office-Orders-and-Immigration.html',
    id_decline_Homelessness: 'ID-declined-Homelessness.html',
    id_decline_Independent_Lifeboat: 'ID-declined-Independent-Lifeboat.html',
    id_decline_MoD_Civil_Servant: 'ID-declined-MoD-Civil-Servant.html',
    id_decline_MoD_Fire_Service: 'ID-declined-MoD-Fire-Service.html',
    id_decline_MoD_Police: 'ID-declined-MoD-Police.html',
    id_decline_NHS_Dental_Practice: 'ID-declined-NHS-Dental-Practice.html',
    id_decline_NHS_Retired: 'ID-declined-NHS-Retired.html',
    id_decline_NHS: 'ID-declined-NHS.html',
    id_decline_not_eligible_generic: 'ID-declined-not-eligible-generic.html',
    id_decline_not_eligible_teachers: 'ID-declined-not-eligible-teachers.html',
    id_decline_Optometrists: 'ID-declined-Optometrists.html',
    id_decline_Personal_Assistants: 'ID-declined-Personal-Assistants.html',
    id_decline_Pharmacy: 'ID-declined-Pharmacy.html',
    id_decline_Police_Bereaved_Family_Member: 'ID-declined-Police-Bereaved-Family-Member.html',
    id_decline_Police_Retired_Officer: 'ID-declined-Police-Retired-Officer.html',
    id_decline_Police: 'ID-declined-Police.html',
    id_decline_Red_Cross: 'ID-declined-Red-Cross.html',
    id_decline_Reserved_Armed_Forces: 'ID-declined-Reserved-Armed-Forces.html',
    id_decline_Retired_Frontline_Ambulance_Staff:
      'ID-declined-Retired-Frontline-Ambulance-Staff.html',
    id_decline_RNLI: 'ID-declined-RNLI.html',
    id_decline_Search_and_Rescue_Rac: 'ID-declined-Search-and-Rescue-Rac.html',
    id_decline_Search_and_Rescue: 'ID-declined-Search-and-Rescue.html',
    id_decline_Social_Care_Care_Company_Workforce:
      'ID-declined-Social-Care-Care-Company-Workforce.html',
    id_decline_Social_Care_Care_Home: 'ID-declined-Social-Care-Care-Home.html',
    id_decline_Social_Care_Council: 'ID-declined-Social-Care-Council.html',
    id_decline_Social_Care_Foster_Carer: 'ID-declined-Social-Care-Foster-Carer.html',
    id_decline_Social_Care_Residential_Care: 'ID-declined-Social-Care-Residential-Care.html',
    id_decline_Social_Care_Social_Worker: 'ID-declined-Social-Care-Social-Worker.html',
    id_decline_St_Andrews_Ambulance: 'ID-declined-St-Andrews-Ambulance.html',
    id_decline_St_John_Ambulance: 'ID-declined-St-John-Ambulance.html',
    id_decline_Teachers: 'ID-declined-Teachers.html',
    id_decline_social_care: 'social_care.html', // decline asking for more information from social care specifically

    // complete application //
    await_id_paid_day_7: 'Await_ID_Paid_Day_7.html', //purchasing but you have not uploaded id yet, still relevant? if so F_NAME needs updating to F_Name
    await_id_paid: 'card-content-awaiting-id-paid.html', // another email asking to upload id when paid
    await_pay_id_approved: 'card-content-id-approved-not-paid.html', // id has been approved but they have not paid (sends you to https://www.bluelightcard.co.uk/highstreetcard.php)
    await_pay_id_approved_day_2: 'ID_Approved_Not_Paid_Day_2.html', // id approved but need to pay - think we have this above so could get rid of, if not needs updating from F_NAME to F_Name

    //unknown
    confirm_eligibility: 'confirm_eligibility.html', //confirming your work email - link doesnt work?
    refund: 'refund.html', // unable to process refund, please provide extra details email (for manual refunds)
  },
  ddsuk: {},
  blcau: {
    // request action from user //
    activation_email_new_journey: 'activation_email_new_journey.html', //F_Name // request action from user // needs updating with verify link
    activation_email: 'activation_email.html', // F_Name  // request action from user // needs updating with verify link
    activation_reminder: 'activation_reminder.html', // F_Name // request action from user // needs updating with verify link
    incorrect_address_reminder: 'incorrect_address_reminder.html', // F_Name // request action from user // my card link/contact us
    validate_renewal: 'validateRenewal.html', //F_Name // request action from user // verify link needs updating
    verify_new_email: 'verify_new_email.html', //F_Name // request action from user // verify link needs updating

    // actions to account //
    account_suspended: 'account_suspended.html', //F_Name // action to account
    approve_account_after_checks: 'approve_account_after_checks.html', //F_Name //action to account if still need (genie)
    card_posted: 'card_posted.html', //F_Name // action to account // my card link needs updating/redirecting
    expire_card: 'expire_card.html', // F_Name // action to account // upload here highstreed card link
    id_approved: 'ID_approved.html', //F_Name //action to account // my card link
    payment_made: 'payment_made.html', //F_Name/transaction reference // action to account / link to support/my account
    promo_payment: 'promo_payment.html', // F_Name // action to account / support/myaccount links
    renew_expired: 'renew_expired.html', //F_Name // action to account
    virtual_card_enabled: 'virtual_card_enabled.html', //F_Name // action to account

    //declines
    id_decline_generic: 'reject_application_generic.html', //F_name //action to account //support/my account link
    id_decline_name: 'id-decline-auto-email-name-doesnt-match.html', //F_Name // action to account // my card link
    id_decline_password_file: 'id-decline-automated-email-file-password-protected.html', //F_Name // action to account
    id_decline_address: 'reject_application_address.html', // F_Name // action to account // my card link
    id_decline_blurry: 'reject_application_blurry.html', // F_Name // action to account // support/my card links
    id_decline_date: 'reject_application_date.html', // F_Name // action to account // my card link/myaccount/support links
    id_decline_drivers: 'reject_application_drivers.html', //F_Name // action to account // support/myaccount links
    id_decline_invalid: 'reject_application_invalid.html', //F_Name // action to account // my card/support/myaccount links
    id_decline_selfie: 'reject_application_selfie.html', //F_Name // action to account // my card/support/ myaccount links
    id_decline_social_care: 'social_care.html', // F_Name // action to account // my card links x2
    id_decline_final: 'reject_application_final.html', // F_Name // action to account / link to faqs// my card/ support/ my account

    // complete application //
    await_id_paid_day_7: 'Await_ID_Paid_Day_7.html', // F_Name // complete application
    bulk_upload_user: 'bulk_upload_user.html', // F_Name // complete application // functionality we need to implement
    await_id_paid: 'card-content-awaiting-id-paid.html', // F_Name //complete application
    await_pay_id_approved: 'card-content-id-approved-not-paid.html', //F_Name // complete application
    await_pay_id_approved_day_2: 'ID_Approved_Not_Paid_Day_2.html', //F_Name // complete application
  },
};
