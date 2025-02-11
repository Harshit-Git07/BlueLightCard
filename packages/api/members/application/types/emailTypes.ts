import { RejectionReason } from '@blc-mono/shared/models/members/enums/RejectionReason';
import { Brand } from '@blc-mono/core/schemas/common';

const brand: Brand =
  (process.env.EMAIL_SERVICE_BRAND as Brand) ?? (process.env.BRAND as Brand) ?? 'BLC_UK';

const brandConversionMapping: Record<Brand, EmailBrand> = {
  BLC_UK: 'blcuk',
  DDS_UK: 'ddsuk',
  BLC_AU: 'blcau',
};

const emailFromMapping: Record<Brand, string> = {
  BLC_UK: 'noreply@bluelightcard.co.uk',
  DDS_UK: 'noreply@defencediscountservice.co.uk',
  BLC_AU: 'noreply@bluelightcard.com.au',
};

export interface auth0LinkReturn {
  memberId: string;
  url: string;
}

export const emailTypes = {
  blcuk: {
    // request action from user //
    activation_email: 'activation_email.html', // verify email - link needs updating
    activation_reminder: 'activation_reminder.html', // reminder to verify your email - link needs updating
    incorrect_address_reminder: 'incorrect_address_reminder.html', // bit confused by this one, seems to be reminding again about an address update, but also mentions you accidently put a home address????
    validate_renewal: 'validateRenewal.html', // i think this is for retired renewal as it says you do not need to upload id, possibly deprecate though?
    verify_new_email: 'verify_new_email.html', // changed email so validate this one (needs to be updated as hits validate.php)
    trusted_domain_work_email: 'confirm_eligibility.html', //F_Name / confirming your work email

    // actions to account //
    account_suspended: 'account_suspended.html', // we have just suspended your account
    //approve_account_after_checks: 'approve_account_after_checks.html', // confirmed maybe? genie stuff, if not in, can deprecate?
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
    refund: 'refund.html', // unable to process refund, please provide extra details email (for manual refunds)
  } as const,
  ddsuk: {
    // request action from user //
    // all of the following are verification emails and get the link from auth0 based on email address provided
    activation_email: 'activation_email.html', //F_Name
    activation_reminder: 'activation_email.html', //F_Name
    trusted_domain_work_email: 'confirm_eligibility.html', //F_Name
    validate_renewal: 'activation_email.html', //F_Name
    verify_new_email: 'verify_new_email.html', //F_Name

    // actions to account //
    account_suspended: 'account_suspended.html', // F_Name
    card_posted: 'card_posted.html', //F_Name/Link (your_card section of 'my account')
    expire_card: 'expire_card.html', //F_Name
    id_approved: 'ID_approved.html', //F_Name
    virtual_card_enabled: 'virtual_card_enabled.html', //F_Name
    payment_made: 'payment_made.html', //F_Name/Link(transaction reference)
    promo_payment: 'promo_payment.html', //F_Name
    renew_expired: 'renew_expired.html', //F_Name

    //new
    refund_failed: 'refund_failed.html', //F_Name  // this email needs to be redesigned with the manual send to finance form we had before
    //dds specific for confirmed
    account_confirmed: 'account_confirmed.html', //F_Name //dds specific approved confirm
    account_declined: 'account_declined.html', //F_name // declined confirm

    //declines
    id_decline_generic: 'id_decline_generic.html', //F_Name
    id_decline_blurry: 'id_decline_blurry.html', //F_Name

    // complete application //
    await_id_paid: 'await_pay_id_approved.html', //F_Name/Link(link to eligibility)
    await_id_paid_day_7: 'await_pay_id_approved.html', //F_Name/Link(link to eligibility)
    await_pay_id_approved: 'card-content-id-approved-not-paid.html', //F_Name/Link(eligibility url),
    await_pay_id_approved_day_2: 'ID_Approved_Not_Paid_Day_2.html', //F_Name/Link(link to eligibility)
  },
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
} as const;

export type EmailBrand = keyof typeof emailTypes;
const emailBrand: EmailBrand = brandConversionMapping[brand];

export type EmailTemplate =
  | keyof (typeof emailTypes)['blcuk']
  | keyof (typeof emailTypes)['ddsuk']
  | keyof (typeof emailTypes)['blcau']
  | 'auth0_verification'; // This comes from braze rather than s3

export type applicationRejectionEmailTemplates = Record<
  EmailBrand,
  { [key in RejectionReason]: EmailTemplate }
>;

export const emailFrom = emailFromMapping[brand] ?? '';

export function isEmailTemplate(emailType: string): emailType is EmailTemplate {
  return getEmailTemplateFileName(emailType as EmailTemplate) !== undefined;
}

export function getEmailTemplateFileName(emailType: EmailTemplate): string | undefined {
  const brandTemplates = emailTypes[emailBrand] as Record<string, string>;

  return brandTemplates[emailType] as string | undefined;
}

export const applicationRejectionReasonEmailType: applicationRejectionEmailTemplates = {
  blcuk: {
    DECLINE_INCORRECT_ID: 'id_decline_invalid',
    PICTURE_DECLINE_ID: 'id_decline_selfie',
    DL_PP_DECLINE_ID: 'id_decline_generic',
    DATE_DECLINE_ID: 'id_decline_date',
    BLURRY_IMAGE_DECLINE_ID: 'id_decline_blurry',
    DIFFERENT_NAME_DECLINE_ID: 'id_decline_generic',
    PASSWORD_PROTECTED_DECLINE_ID: 'id_decline_automated_email_file_password_protected',
    DECLINE_NOT_ELIGIBLE: 'id_decline_generic',
  },
  blcau: {
    DECLINE_INCORRECT_ID: 'id_decline_invalid',
    PICTURE_DECLINE_ID: 'id_decline_selfie',
    DL_PP_DECLINE_ID: 'id_decline_generic',
    DATE_DECLINE_ID: 'id_decline_date',
    BLURRY_IMAGE_DECLINE_ID: 'id_decline_blurry',
    DIFFERENT_NAME_DECLINE_ID: 'id_decline_name',
    PASSWORD_PROTECTED_DECLINE_ID: 'id_decline_password_file',
    DECLINE_NOT_ELIGIBLE: 'id_decline_generic',
  },
  ddsuk: {
    DECLINE_INCORRECT_ID: 'id_decline_generic',
    PICTURE_DECLINE_ID: 'id_decline_generic',
    DL_PP_DECLINE_ID: 'id_decline_generic',
    DATE_DECLINE_ID: 'id_decline_generic',
    BLURRY_IMAGE_DECLINE_ID: 'id_decline_blurry',
    DIFFERENT_NAME_DECLINE_ID: 'id_decline_generic',
    PASSWORD_PROTECTED_DECLINE_ID: 'id_decline_generic',
    DECLINE_NOT_ELIGIBLE: 'id_decline_generic',
  },
};

export function getEmailTypeForApplicationRejectionReason(reason: RejectionReason): EmailTemplate {
  const brandTemplates = applicationRejectionReasonEmailType[emailBrand];
  return brandTemplates[reason];
}
