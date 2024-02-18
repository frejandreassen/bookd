export const getVerificationEmailContent = ({ verificationLink }) => ({
    subject: 'Welcome to Bookd! Let’s Verify Your Email',
    text: `Welcome to Bookd! You're just one click away from revolutionizing your booking experience. Please verify your email by clicking on the link below: ${verificationLink} If you have any questions, feel free to reach out to our support team. Thank you for choosing Bookd.`,
    html: `
          <div style="font-family: Arial, sans-serif; color: #333333;">
              <h2 style="color: #e0345f;">Welcome to Bookd!</h2>
              <p>Thank you for signing up. You’re just one click away from revolutionizing your booking experience.</p>
              <p>Please confirm your email address to get started:</p>
              <div style="margin: 20px 0;">
                  <a href="${verificationLink}" style="background-color: #e0345f; color: white; padding: 10px 20px; cursor: pointer; border-radius: 5px; text-decoration: none;">Verify Email</a>
              </div>
              <p>If the button above does not work, paste this link into your web browser:</p>
              <a href="${verificationLink}" style="color: #e0345f; text-decoration: none;">${verificationLink}</a>
              <p>If you have any questions or concerns, we're here to help. Contact us at <a href="mailto:support@bookd.xyz" style="color: #e0345f; text-decoration: none;">support@bookd.xyz</a>.</p>
              <p>Thank you for choosing Bookd, where booking your favorite room or resource is just a click away!</p>
              <p style="font-size: small; color: #999999;">If you did not sign up for a Bookd account, please disregard this email.</p>
          </div>
      `,
  })

  export const getPasswordResetEmailContent = ({ passwordResetLink }) => ({
    subject: 'Bookd Password Reset Request',
    text: `You have requested to reset your password for your Bookd account. Please use the link below to set up a new password: ${passwordResetLink} If you did not request a password reset, please ignore this email or contact our support team if you have concerns. Thank you for using Bookd.`,
    html: `
          <div style="font-family: Arial, sans-serif; color: #333333;">
              <h2 style="color: #e0345f;">Need to reset your password?</h2>
              <p>We received a request to reset the password for your Bookd account.</p>
              <p>Please click the button below to set up a new password:</p>
              <div style="margin: 20px 0;">
                  <a href="${passwordResetLink}" style="background-color: #e0345f; color: white; padding: 10px 20px; cursor: pointer; border-radius: 5px; text-decoration: none;">Reset Password</a>
              </div>
              <p>If the button above does not work, please paste this link into your web browser:</p>
              <a href="${passwordResetLink}" style="color: #e0345f; text-decoration: none;">${passwordResetLink}</a>
              <p>If you did not request a password reset, please ignore this email or let us know. We’re here to help: <a href="mailto:support@bookd.xyz" style="color: #e0345f; text-decoration: none;">support@bookd.xyz</a></p>
              <p>Thank you for using Bookd. We’re here to ensure your booking experience is seamless and secure.</p>
              <p style="font-size: small; color: #999999;">If you did not request this password reset, please disregard this email or contact us for support.</p>
          </div>
      `,
  })

