import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  restrictToVerticalAxis,
  restrictToParentElement
} from '@dnd-kit/modifiers';

import {
  List, ListItem, ListItemIcon, ListItemText, Checkbox, Box
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { motion } from 'framer-motion';

function SortableItem({ id, title, secondary, checked, onToggle, isDragging }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    userSelect: 'none',
    transform: CSS.Transform.toString(transform),
    transition,
    border: '1px solid #ddd',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    margin: '10px 8px',
    padding: '8px',
    boxShadow: isDragging ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
    zIndex: isDragging ? 999 : 'auto',
    position: isDragging ? 'relative' : 'static',
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...(!isDragging && { layout: true })} // 只在非拖拽时启用动画
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      {...attributes}
    >
      <ListItemIcon>
        <Checkbox
          onClick={(e) => {
            e.stopPropagation();
            onToggle(id);
          }}
          checked={checked.includes(id)}
          tabIndex={-1}
          disableRipple
        />
      </ListItemIcon>
      <ListItemText
        primary={` ${title}`}
        secondary={` ${secondary}`}
      />
      <Box sx={{ cursor: 'grab', touchAction: 'none' }} {...listeners}>
        <DragIndicatorIcon />

      </Box>
    </motion.div>
  );
}

const CheckboxList = (props) => {
  const [items, setItems] = useState(props.data);
  const [checked, setChecked] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    // console.log('🚀 ~ 获取的所有页面', props.currentArray);
    if (!Array.isArray(props.currentArray)) return;

    // 获取已勾选项（按传入顺序保留）
    const selected = props.currentArray
      .map(id => items.find(item => item.id === id))
      .filter(Boolean); // 过滤掉找不到的

    // 获取未勾选项（保持 items 原顺序）
    const selectedIds = new Set(props.currentArray);
    const unselected = items.filter(item => !selectedIds.has(item.id));

    // 合并：已选项 + 未选项
    const newItems = [...selected, ...unselected];

    // 更新状态
    setChecked(props.currentArray);
    setItems(newItems);
  }, []);


  // const sensors = useSensors(useSensor(PointerSensor));
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    })
  );

  const handleToggle = (id) => {
    const isChecked = checked.includes(id);

    let newChecked = isChecked
      ? checked.filter((v) => v !== id)
      : [...checked, id];

    // 根据新 checked 划分 selected/unselected
    const selected = [];
    const unselected = [];

    for (const item of items) {
      if (newChecked.includes(item.id)) {
        selected.push(item);
      } else {
        unselected.push(item);
      }
    }

    let newItems;
    if (isChecked) {
      // 取消选中：把当前项放在未选中最前
      const unselectedWithMoved = [items.find(i => i.id === id), ...unselected.filter(i => i.id !== id)];
      newItems = [...selected, ...unselectedWithMoved];
    } else {
      // 选中：保持原顺序（当前顺序）
      newItems = [...selected, ...unselected];
    }

    // 去重 checked
    newChecked = Array.from(new Set(newChecked));

    setChecked(newChecked);
    setItems(newItems);

    const sortedChecked = newItems
      .filter(item => newChecked.includes(item.id))
      .map(item => item.id);

    props.onDrag(sortedChecked);
  };


  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      const sortedChecked = newItems
        .filter(item => checked.includes(item.id))
        .map(item => item.id);

      props.onDrag(sortedChecked);
    }
    setActiveId(null);
  };


  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy} >
        <List >
          {items.map((value) => (
            <SortableItem
              key={value.id}
              id={value.id}
              title={value.title}
              secondary={value.description}
              checked={checked}
              onToggle={handleToggle}
              isDragging={value.id === activeId}
            />
          ))}
        </List>
      </SortableContext>
    </DndContext>
  );
};

export default CheckboxList;
