import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaCirclePlay } from "react-icons/fa6";

export function TabsDemo() {
  return (
    <Tabs
      defaultValue="account"
      className="w-[85%] min-w-[250px] h-full mx-auto pt-2"
    >
      <TabsList className="flex justify-center bg-[#3f3f3f] text-white items-center w-full">
        <TabsTrigger value="account">Funny</TabsTrigger>
        <TabsTrigger value="q">Serious</TabsTrigger>
        <TabsTrigger value="account2">Notorious</TabsTrigger>
      </TabsList>
      <TabsContent
        className="text-white flex justify-center items-center h-[100%] mt-[-30px]  "
        value="account"
      >
        <FaCirclePlay className="w-12 h-12 cursor-pointer" />
      </TabsContent>
      <TabsContent className="text-white" value="q">
        <h1>Pass</h1>
      </TabsContent>
      <TabsContent className="text-white" value="account2">
        <h1>Acc2</h1>
      </TabsContent>
    </Tabs>
  );
}

export default TabsDemo;
