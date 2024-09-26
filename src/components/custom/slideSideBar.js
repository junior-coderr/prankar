import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";

import React from "react";

const SlideSideBar = (props) => {
  return (
    <Sheet>
      <SheetTrigger>Ahoy, {props.content.user.name.split(" ")[0]}</SheetTrigger>
      <SheetContent className="bg-[#2F322F] border-0 w-[200px] text-white">
        <SheetHeader>
          <br />
          {/* <SheetTitle>Are you absolutely sure?</SheetTitle> */}
          <SheetDescription className="text-white">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default SlideSideBar;
