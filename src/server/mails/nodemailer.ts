import { render } from '@react-email/render';
import * as MAILS from '@mails/index';
import nodemailer from 'nodemailer';
import React from 'react';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT as string),
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

type TMail = keyof typeof MAILS;
type TMailData = {
  sendTo: string;
  subject: string;
};
export const sendMail = async <T extends TMail, K extends React.ComponentProps<(typeof MAILS)[T]>>(
  mail: T,
  props: K,
  mailData: TMailData,
) => {
  try {
    const html = render(MAILS[mail]({ ...(props as any) }));

    const { sendTo, subject } = mailData;

    await transporter.sendMail({
      from: 'olejarnia@olejesawiniec.pl',
      to: sendTo,
      html,
      subject,
    });

    return { success: true };
  } catch (error) {
    console.log('Mail send error!', error);
    return { error: true };
  }
};
