import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Plus, Type, Image, Layout, FileText, QuoteIcon, FormInput, Video } from "lucide-react"
import styled from "styled-components"

const widgets = [
  {
    id: 'card',
    icon: <Plus size={16} />,
    label: 'Add Card'
  },
  {
    id: 'quiz',
    icon: <QuoteIcon size={16} />,
    label: 'Add Quiz'
  },
  {
    id: 'form',
    icon: <FormInput size={16} />,
    label: 'Add Form'
  },
  {
    id: 'video',
    icon: <Video size={16} />,
    label: 'Video'
  },
  {
    id: 'text',
    icon: <Type size={16} />,
    label: 'Text Block'
  },
  {
    id: 'image',
    icon: <Image size={16} />,
    label: 'Image'
  },
  {
    id: 'layout',
    icon: <Layout size={16} />,
    label: 'Layout'
  },
  {
    id: 'template',
    icon: <FileText size={16} />,
    label: 'Template'
  }
]


export default function ToolBar({ onClick }) {
  return (
    // <Wrapper className="toolbar">
    //     Widgets
    //     <Widget onClick={() => onClick('card')}>
    //       Card
    //     </Widget>
    // </Wrapper>
    <ToolbarWrapper>
      <Card className="w-[90px] h-screen">
        <CardContent className="p-4">
          <ScrollArea className="h-full w-full">
            <div className="flex flex-col gap-4">
              {widgets.map((widget) => (
                <div key={widget.id}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-full h-14 flex flex-col gap-1"
                    onClick={() => onClick(widget.id)}
                  >
                    {widget.icon}
                    <span className="text-xs">{widget.label}</span>
                  </Button>
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </ToolbarWrapper>
  )
};

const ToolbarWrapper = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  z-index: 50;
`


const Wrapper = styled.div`
  /* position: absolute; */
  width: 80px;
  height: 400px;
  background-color: #8ce3d6;
  right: 0;
  z-index: 100;
`;

const Widget = styled.div`
  width: 100%;
  height: 50px;
  background-color: aliceblue;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
