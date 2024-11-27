"use client";
import React from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import Loader3 from "./loader3";

const TermsACPopup = ({ open, onAccept, isLoading }) => {
  return (
    <Dialog open={open} hideCloseButton>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Conditions</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="text-sm max-h-[350px] overflow-auto">
            By accepting these terms, you agree to:
            <ul className="list-disc ml-5 mt-2">
              <li>
                This platform and its features, including prerecorded and custom
                audio options, are provided solely for entertainment and fun. By
                using this service, users acknowledge that it is intended only
                for lighthearted purposes and should not be used to harass,
                intimidate, or cause distress to recipients.
              </li>
              <li>
                The prerecorded audio options provided on this platform may
                include content meant to be humorous, though it may be perceived
                as offensive or distressing to some. Users acknowledge the
                nature of this content and engage with it voluntarily,
                understanding that it is meant for entertainment.
              </li>
              <li>
                The platform allows users to upload custom audio for calls.
                Users agree not to upload content that is offensive, harmful, or
                illegal, and to use such content solely for lawful and
                lighthearted interactions. The platform reserves the right to
                review, reject, or remove custom audio that does not align with
                these terms.
              </li>
              <li>
                Users are responsible for obtaining the recipient&apos;s consent
                before using any audio content. Any emotional impact resulting
                from a call made with either prerecorded or custom audio is the
                sole responsibility of the user initiating the call.
              </li>
              <li>
                Users acknowledge that some content may be perceived differently
                by each recipient. By accepting these terms, users assume all
                risks related to any distress or discomfort that recipients may
                experience, understanding that the intent is entertainment only.
              </li>
              <li>
                All users must comply with applicable laws, including those
                governing telecommunications and privacy. The platform may take
                action if misuse or unlawful conduct is detected, including
                termination of user access.
              </li>
              <li>
                The platform disclaims all liability for any emotional distress,
                reputational harm, or other consequences resulting from use of
                either prerecorded or custom audio. This service is provided for
                entertainment purposes only, and any other use is prohibited.
              </li>
            </ul>
          </div>
        </div>
        <DialogFooter className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <Link
            href="/termsandconditions"
            className="text-sm text-blue-500 hover:text-blue-400"
            target="_blank"
          >
            View Full Terms & Conditions
          </Link>
          <Button onClick={onAccept} disabled={isLoading}>
            {isLoading ? <Loader3 /> : "Accept & Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TermsACPopup;
