"use client";
import React, { useState, useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  Modal,
  ModalContent,
  ModalHeader,
  Card,
  ScrollShadow,
  Button,
  Badge,
} from "@nextui-org/react";
import ChatPanel from "./components/ChatPanel";
import { IoClose } from "react-icons/io5";
import { VscChromeMinimize } from "react-icons/vsc";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

type Document = {
  id: number;
  title: string;
  content: string;
};

const documents: Document[] = [
  {
    id: 1,
    title: "Product RoadMap 1",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
  },
  {
    id: 2,
    title: "Product RoadMap 2",
    content:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
  },
  {
    id: 3,
    title: "Product RoadMap 3",
    content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco...",
  },
  {
    id: 4,
    title: "Product RoadMap 4",
    content:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse...",
  },
];

const taskGuides = [
  "1. Understand the task",
  "2. Understand the case",
  "3. Identify the Main Problems",
  "4. Analyze the Problems",
];

const LeftPanel = ({
  activeTab,
  setActiveTab,
  documents,
  taskGuides,
  onDocumentClick,
}) => (
  <Card className="h-full">
    <div className="p-4 bg-gray-900 text-white h-full">
      <h2 className="text-2xl font-bold mb-4">Resources</h2>
      <div className="flex w-full mb-4">
        <Button
          className={`mr-2 ${
            activeTab === "Documents" ? "bg-gray-700" : "bg-gray-800"
          }`}
          onClick={() => setActiveTab("Documents")}
        >
          <span
            className={`${
              activeTab === "Documents" ? "text-white" : "text-black"
            }`}
            onClick={() => setActiveTab("Documents")}
          >
            Documents
          </span>
        </Button>
        <Button
          className={
            activeTab === "Task Guides" ? "bg-gray-700" : "bg-gray-800"
          }
          onClick={() => setActiveTab("Task Guides")}
        >
          <span
            className={`${
              activeTab === "Task Guides" ? "text-white" : "text-black"
            }`}
            onClick={() => setActiveTab("Documents")}
          >
            Task Guides
          </span>
        </Button>
      </div>
      <ScrollShadow className="h-[calc(100vh-200px)]">
        {activeTab === "Documents"
          ? documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-gray-800 p-3 mb-2 rounded cursor-pointer"
                onClick={() => onDocumentClick(doc)}
              >
                <h3 className="font-semibold">{doc.title}</h3>
                <p className="text-sm text-gray-400">
                  Overview of upcoming projects and roadmaps
                </p>
              </div>
            ))
          : taskGuides.map((guide, index) => (
              <div key={index} className="bg-gray-800 p-3 mb-2 rounded">
                <h3 className="font-semibold">{guide}</h3>
                <p className="text-sm text-gray-400">
                  Description of the task guide step
                </p>
              </div>
            ))}
      </ScrollShadow>
    </div>
  </Card>
);

const DocumentView = ({ document, onClose, onMinimize }) => (
  <Card className="h-full w-full">
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{document.title}</h2>
      <IoClose
        size={24}
        className="cursor-pointer absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        onClick={onClose}
      />
      <ScrollShadow className="h-[calc(100vh-100px)]">
        <p>
          {document.content} What is Lorem Ipsum? Lorem Ipsum is simply dummy
          text of the printing and typesetting industry. Lorem Ipsum has been
          the industry's standard dummy text ever since the 1500s, when an
          unknown printer took a galley of type and scrambled it to make a type
          specimen book. It has survived not only five centuries, but also the
          leap into electronic typesetting, remaining essentially unchanged. It
          was popularised in the 1960s with the release of Letraset sheets
          containing Lorem Ipsum passages, and more recently with desktop
          publishing software like Aldus PageMaker including versions of Lorem
          Ipsum. Why do we use it? It is a long established fact that a reader
          will be distracted by the readable content of a page when looking at
          its layout. The point of using Lorem Ipsum is that it has a
          more-or-less normal distribution of letters, as opposed to using
          'Content here, content here', making it look like readable English.
          Many desktop publishing packages and web page editors now use Lorem
          Ipsum as their default model text, and a search for 'lorem ipsum' will
          uncover many web sites still in their infancy. Various versions have
          evolved over the years, sometimes by accident, sometimes on purpose
          (injected humour and the like). Where does it come from? Contrary to
          popular belief, Lorem Ipsum is not simply random text. It has roots in
          a piece of classical Latin literature from 45 BC, making it over 2000
          years old. Richard McClintock, a Latin professor at Hampden-Sydney
          College in Virginia, looked up one of the more obscure Latin words,
          consectetur, from a Lorem Ipsum passage, and going through the cites
          of the word in classical literature, discovered the undoubtable
          source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de
          Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero,
          written in 45 BC. This book is a treatise on the theory of ethics,
          very popular during the Renaissance. The first line of Lorem Ipsum,
          "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
          The standard chunk of Lorem Ipsum used since the 1500s is reproduced
          below for those interested. Sections 1.10.32 and 1.10.33 from "de
          Finibus Bonorum et Malorum" by Cicero are also reproduced in their
          exact original form, accompanied by English versions from the 1914
          translation by H. Rackham. Where can I get some? There are many
          variations of passages of Lorem Ipsum available, but the majority have
          suffered alteration in some form, by injected humour, or randomised
          words which don't look even slightly believable. If you are going to
          use a passage of Lorem Ipsum, you need to be sure there isn't anything
          embarrassing hidden in the middle of text. All the Lorem Ipsum
          generators on the Internet tend to repeat predefined chunks as
          necessary, making this the first true generator on the Internet. It
          uses a dictionary of over 200 Latin words, combined with a handful of
          model sentence structures, to generate Lorem Ipsum which looks
          reasonable. The generated Lorem Ipsum is therefore always free from
          repetition, injected humour, or non-characteristic words etc. 5
          paragraphs words bytes lists Start with 'Lorem ipsum dolor sit
          amet...'
        </p>
      </ScrollShadow>
    </div>
  </Card>
);

// const ChatPage = ({ isOpen, onClose, status, agent }) => {
//   const [activeTab, setActiveTab] = useState("Documents");
//   const [selectedDocument, setSelectedDocument] = useState<Document | null>(
//     null
//   );
//   const [isChatMinimized, setIsChatMinimized] = useState(false);

//   const handleDocumentClick = (document: Document) => {
//     setSelectedDocument(document);
//   };

//   const handleDocumentClose = () => {
//     setSelectedDocument(null);
//   };

//   const toggleChatMinimize = () => {
//     setIsChatMinimized(!isChatMinimized);
//   };

//   useEffect(() => {
//     console.log("$$$", agent);
//   }, [agent]);

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} size="full" hideCloseButton>
//       <ModalContent>
//         {(onClose) => (
//           <div className="h-screen flex flex-col">
//             <div className="flex-grow flex">
//               <PanelGroup direction="horizontal" className=" h-full w-full">
//                 {/* Left Panel (Resources + Documents) */}
//                 <Panel defaultSize={25} minSize={18} maxSize={25}>
//                   <LeftPanel
//                     activeTab={activeTab}
//                     setActiveTab={setActiveTab}
//                     documents={documents}
//                     taskGuides={taskGuides}
//                     onDocumentClick={handleDocumentClick}
//                   />
//                 </Panel>
//                 <PanelResizeHandle />
//                 {/* Middle and Right Panels (Document View + Chat) */}
//                 <Panel>
//                   <div className="relative h-full">
//                     <PanelGroup direction="horizontal">
//                       {/* {selectedDocument && !isChatMinimized && (
//                         <Panel defaultSize={isChatMinimized ? 100 : 50} minSize={30}>
//                           <div className="h-full">
//                             <DocumentView
//                               document={selectedDocument}
//                               onMinimize={isChatMinimized}
//                               onClose={handleDocumentClose}
//                             />
//                           </div>
//                         </Panel>
//                       )} */}
//                       {/* {selectedDocument && isChatMinimized && (
//                         <Panel defaultSize={100} minSize={30}>
//                         <div className="h-full">
//                           <DocumentView
//                             document={selectedDocument}
//                             onMinimize={isChatMinimized}
//                             onClose={handleDocumentClose}
//                           />
//                         </div>
//                       </Panel>
//                       )} */}

//                       {selectedDocument && !isChatMinimized && (
//                         <>
//                           <Panel defaultSize={50} minSize={30}>
//                             <div className="h-full">
//                               <DocumentView
//                                 document={selectedDocument}
//                                 onClose={handleDocumentClose}
//                                 onMinimize={toggleChatMinimize}
//                               />
//                             </div>
//                           </Panel>
//                           <PanelResizeHandle />
//                         </>
//                       )}
//                       {(isChatMinimized && selectedDocument) ||
//                       (!selectedDocument && !isChatMinimized) ? (
//                         <Panel defaultSize={100} minSize={30}>
//                           {isChatMinimized && selectedDocument ? (
//                             <div className="h-full">
//                               <DocumentView
//                                 document={selectedDocument}
//                                 onClose={handleDocumentClose}
//                                 onMinimize={toggleChatMinimize}
//                               />
//                             </div>
//                           ) : (
//                             <div className="relative w-full h-full z-50">
//                               <ChatPanel
//                                 agent={agent}
//                                 onClose={onClose}
//                                 selectedDocument={selectedDocument}
//                                 onMinimize={toggleChatMinimize}
//                               />
//                             </div>
//                           )}
//                         </Panel>
//                       ) : null}
//                       {!isChatMinimized && selectedDocument && (
//                         <Panel defaultSize={50} minSize={30}>
//                           <div className="relative w-full h-full">
//                             <ChatPanel
//                               agent={agent}
//                               onClose={onClose}
//                               selectedDocument={selectedDocument}
//                               onMinimize={toggleChatMinimize}
//                             />
//                           </div>
//                         </Panel>
//                       )}
//                       <PanelResizeHandle />
//                       {/* <Panel
//                         defaultSize={selectedDocument ? 100 : 50}
//                         minSize={30}
//                       >
//                         <div className="relative w-full h-full z-50">
//                           <ChatPanel
//                             agent={agent}
//                             onClose={onClose}
//                             selectedDocument={selectedDocument}
//                             onMinimize={toggleChatMinimize}
//                           />
//                         </div>
//                       </Panel> */}
//                     </PanelGroup>
//                   </div>
//                 </Panel>
//               </PanelGroup>
//             </div>
//           </div>
//         )}
//       </ModalContent>
//     </Modal>
//   );
// };

// export default ChatPage;

const ChatPage = ({ isOpen, onClose, status, agent }) => {
  const [activeTab, setActiveTab] = useState("Documents");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
  };

  const handleDocumentClose = () => {
    setSelectedDocument(null);
  };

  const toggleChatMinimize = () => {
    setIsChatMinimized(!isChatMinimized);
  };

  useEffect(() => {
    console.log("$$$", agent);
  }, [agent]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" hideCloseButton>
      <ModalContent>
        {(onClose) => (
          <div className="h-screen flex flex-col">
            <div className="flex-grow flex">
              <PanelGroup direction="horizontal" className="h-full w-full">
                {/* Left Panel (Resources + Documents) */}
                <Panel defaultSize={25} minSize={18} maxSize={25}>
                  <LeftPanel
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    documents={documents}
                    taskGuides={taskGuides}
                    onDocumentClick={handleDocumentClick}
                  />
                </Panel>
                <PanelResizeHandle />
                {/* Middle and Right Panels (Document View + Chat) */}
                <Panel>
                  <PanelGroup direction="horizontal">
                    {selectedDocument && (
                      <Panel defaultSize={isChatMinimized ? 100 : 50} minSize={30}>
                        <DocumentView
                          document={selectedDocument}
                          onClose={handleDocumentClose}
                          onMinimize={toggleChatMinimize}
                        />
                      </Panel>
                    )}
                    {!isChatMinimized && (
                      <>
                        {selectedDocument && <PanelResizeHandle />}
                        <Panel defaultSize={selectedDocument ? 50 : 100} minSize={30}>
                          <ChatPanel
                            agent={agent}
                            onClose={onClose}
                            selectedDocument={selectedDocument}
                            onMinimize={toggleChatMinimize}
                          />
                        </Panel>
                      </>
                    )}
                  </PanelGroup>
                  {isChatMinimized && (
                    <div className="absolute bottom-4 right-4 z-30">
                      <Button
                        isIconOnly
                        color="primary"
                        aria-label="Chat"
                        className="rounded-full w-12 h-12"
                        onClick={toggleChatMinimize}
                      >
                        <IoChatbubbleEllipsesOutline className="w-6 h-6" />
                      </Button>
                    </div>
                  )}
                </Panel>
              </PanelGroup>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ChatPage;


